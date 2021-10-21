//import Role

import {User} from "../../lib/classes/user";
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

Meteor.publish("usersData", function() {
  if (!this.userId) return this.ready();
  let fields = {};
  if (Role.is("SuperAdministrator")) {
    publishCount(this, 'usersData-count', Meteor.users.find({}, { fields: { _id: true }}), { noReady: true });
    return Meteor.users.find({},{fields:fields})
  }
  return Meteor.users.find({"_id": this.userId})
})

Meteor.publish("myUser",function() {
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      username: 1,
      emails: 1,
      profile: 1
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
      if (this.profile.password)
        this.profile.validate({fields: ["password"], stopOnFirstError: false})

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