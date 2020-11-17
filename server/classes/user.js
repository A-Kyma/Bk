//import Role

import User from "../../lib/classes/user";
import Role from "../../lib/classes/role";
import {Accounts} from "meteor/accounts-base";

Accounts.onCreateUser((options,user) => {
    if (!Meteor.users.findOne()) {
      Role.getCollection().insert({
          access: "SuperAdministrator",
          user: user._id
        }
      )
    }
    if (options.profile) {
      user.profile = options.profile
      user.profile.status = "active"
    }
    return user;
  }
)

Accounts.validateLoginAttempt((options) => {
    if (options.user && options.user.profile.status === "inactive") {
      throw new Meteor.error(400, "Your account is inactive, check with administrator");
    }
  }
)

Meteor.publish("usersData", function() {
  if (!this.userId) return this.ready();
  let fields = {};
  if (Role.is("SuperAdministrator",this.userId)) return Meteor.users.find({},{fields:fields})
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
      let profile = this.profile;
      delete profile.emailConfirmation
      delete profile.passwordConfirmation
      let fields = this.profile.constructor.getFieldsNamesByFilter({
        exclude: ["emailConfirmation","password","passwordConfirmation"]
      })
      this.profile.validate({fields,stopOnFirstError: false})
      delete profile._errors;
      let options = {
        username: this.profile.email,
        email: this.profile.email,
        password: this.profile.password,
        profile: profile,
      }
      return Accounts.createUser(options);
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
