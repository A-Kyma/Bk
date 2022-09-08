import { Class } from 'meteor/jagi:astronomy'
import Email from "../modules/customFields/classes/Email";
import Password from "../modules/customFields/classes/Password";
import Languages from "../modules/customFields/types/language";
import Image from "../modules/customFields/classes/Image";
import { Accounts } from "meteor/accounts-base";
import {Device} from "./device";

const UserProfile = Class.create({
  name: 'UserProfile',
  fields: {
    avatar: { type: Image, optional: true },
    firstname: { type: String, minLength: 2 },
    lastname: { type: String, minLength:2 },
    email: {
      type: Email,
      ui: { preventPaste: true }
    },
    emailConfirmation: {
      type: Email,
      confirm({doc,value}) { return doc.email === value },
      ui: { preventPaste: true }
    },
    oldPassword: { type: Password, ui: { preventPaste: true } },
    password: { type: Password, ui: { preventPaste: true } },
    passwordConfirmation: {
      type: Password,
      confirm({doc,value}) {
        return doc.password === value
      },
      ui: { preventPaste: true }
    },
    language: { type: Languages },
    devices: {type: [Device], optional: true }
  },
})

const User = Class.create({
  name: 'User',
  secured: false,
  collection: Meteor.users,
  fields: {
    createdAt: { type: Date, optional: true },
    emails: {
      type: [Email],
      default() { return []; }
    },
    username: { type: Email },
    profile: {
      type: UserProfile,
      default() { return {}; }
    }
  },
  defaultName() { return this.profile.firstname + " " + this.profile.lastname },
  helpers: {
    createUserFromClient(callback) {
      let user = new User(this.raw());
      delete user.profile.passwordConfirmation;
      delete user.profile.emailConfirmation;
      if (user.profile.password)
        user.profile.password = Accounts._hashPassword(user.profile.password);
      user.callMethod("createUser",callback)
      //Accounts.createUser(options,callback);
    },
    initials() {
      if (!this.profile.firstname || !this.profile.lastname) return ""
      let initials = this.profile.firstname.substr(0,1) + this.profile.lastname.substr(0,1)
      return initials.toUpperCase()
    }
  }
})

export { User, UserProfile };