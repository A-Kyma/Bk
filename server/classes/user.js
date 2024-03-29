//import Role

import {User} from "../../lib/classes/user";
import {Device} from "../../lib/classes/device";
import Role from "../../lib/classes/role";
import {Accounts} from "meteor/accounts-base";
import { Counts, publishCount } from "meteor/tmeasday:publish-counts";
import _cloneDeep from "lodash"

// Accounts.onCreateUser((options,user) => {
//     if (options.profile) {
//       user.profile = options.profile
 //      user.profile.status = "inactive"
//     }
//     return user;
//   }
// )

// Accounts.validateLoginAttempt((options) => {
//     // if (options.user && options.user.profile.status === "inactive") {
//     //   throw new Meteor.Error(400, "Your account is inactive, check with administrator");
//     // }
//   return true
//   }
// )

Meteor.publish("usersData", function(selector,options={}) {
  if (!this.userId) return this.ready();
  if (Role.is("SuperAdministrator")) {
    publishCount(this, 'usersData-count', Meteor.users.find(selector, { fields: { _id: true }}), { noReady: true });
    // usersData collection is only on client side. This is used in order to manage datatable when logged in
    Mongo.Collection._publishCursor(Meteor.users.find(selector,options),this,"usersData")
    return this.ready()
  }
  return Meteor.users.find({"_id": this.userId})
})

Meteor.publish("myUser",function() {
  if (!this.userId) return this.ready();
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      username: 1,
      emails: 1,
      profile: 1,
      "profile.devices": 0,
    }
  })
})

User.extend({
  fields: {
    services: Object
  },
  meteorMethods: {
    createUser() {
      let username = this.profile.email
      let email = this.profile.email
      let password = this.profile.password

      let fields = this.profile.constructor.getFieldsNamesByFilter({
        exclude: ["emailConfirmation","oldPassword","password","passwordConfirmation"]
      })

      this.profile.validate({fields,stopOnFirstError: false})
      //if (this.profile.password)
      //  this.profile.validate({fields: ["password"], stopOnFirstError: false})

      let profile = this.profile.raw()
      delete profile._errors;
      delete profile.email
      delete profile.emailConfirmation
      delete profile.oldPassword
      delete profile.password
      delete profile.passwordConfirmation

      let options = {
        username,
        email,
        password,
        profile,
      }
      let userId = Accounts.createUser(options);
      if (!password)
        Accounts.sendEnrollmentEmail(userId)
    },
    createUserByAdmin(options) {
      if (Role.is("Administrator") || !User.findOne()) {
        let u = User.findOne({username: options.username})
        if (u) throw new Meteor.Error(400, "Username already exists")
        return Accounts.createUser(options)
      } else {
        throw new Meteor.Error(400, "You don't have rights to create user")
      }
    },
    setPasswordByAdmin(uid, hash) {
      check(uid, String)
      if (Role.is("Administrator") && uid !== Meteor.userId()) {
        Accounts.setPassword(uid, hash)
        return uid;
      } else {
        throw new Meteor.Error(400, "You don't have rights to change password")
      }
    },
    setDevice(jsonData,send_notification=true){
      if (!Meteor.userId()) return
      let userId

      if (typeof jsonData === "string"){
        if (jsonData.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') !== null){
          userId = jsonData
        }
      } else if (jsonData?.userId){
        userId = jsonData.userId
      }
      if (userId){
        const device = new Device()

        device.id = userId
        device.getOneSignalUserDeviceDetails(result => {
          if (result.id !== undefined) {
            let oneSignalUserDevice = {}
            oneSignalUserDevice.id = result.id
            oneSignalUserDevice.identifier = result.identifier
            oneSignalUserDevice.device_os = result.device_os
            oneSignalUserDevice.device_model = result.device_model
            oneSignalUserDevice.session_count = result.session_count
            oneSignalUserDevice.timezone = result.timezone
            oneSignalUserDevice.created_at = new Date(result.created_at * 1000)
            oneSignalUserDevice.updated_at = new Date()
            oneSignalUserDevice.last_active = new Date(result.last_active * 1000)
            oneSignalUserDevice.send_notification = send_notification //default notification set to true

            let param = {
              fields: ['profile.devices'],
              simulation: false // Insert only on the server.
            }

            // get the userprofile existing devices and verify if it already exists
            const user = User.findOne({_id: Meteor.userId()})

            if (user.profile.devices.length === 0) {
              //no devices yet
              user.profile.devices.push(oneSignalUserDevice);
              user.save(param);
            } else {
              //already a device in collection.
              let found = false
              for (let deviceItem of user.profile.devices) {
                if ((deviceItem.device_model === oneSignalUserDevice.device_model && deviceItem.device_os === oneSignalUserDevice.device_os)
                || (deviceItem.id === oneSignalUserDevice.id && deviceItem.identifier === oneSignalUserDevice.identifier)){
                  found = true
                  deviceItem.id = oneSignalUserDevice.id
                  deviceItem.session_count = oneSignalUserDevice.session_count
                  deviceItem.updated_at = oneSignalUserDevice.updated_at
                  deviceItem.device_model = oneSignalUserDevice.device_model
                  deviceItem.device_os = oneSignalUserDevice.device_os
                  if (deviceItem.identifier !== oneSignalUserDevice.identifier) {
                    deviceItem.identifier = oneSignalUserDevice.identifier
                  }
                  user.save(param);
                  break;
                }
              }
              if (!found) {
                // the device was not found. we have to create a new one
                user.profile.devices.push(oneSignalUserDevice);
                user.save(param);
              }
            }
            ;
          }
        })
      }else{
        throw new Meteor.Error("Meteor Error: Device userID empty", JSON.stringify({
          user: Meteor.userId(),
          jsonData
        }))
      }
    }
  }
},["fields","meteorMethods"])


Meteor.methods({
  "User:CreatePassword": function(token,password) {
    Accounts.resetPassword(token,password)
  },
  "User:ChangePassword": function(token,password) {
    Accounts.resetPassword(token,password)
  }
})