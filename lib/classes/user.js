import { Class } from 'meteor/jagi:astronomy'
import Email from "../modules/customFields/classes/Email";
import Password from "../modules/customFields/classes/Password";
import Languages from "../modules/customFields/types/language";
import Image from "../modules/customFields/classes/Image";
import { Accounts} from "meteor/accounts-base";

const UserProfile = Class.create({
  name: 'UserProfile',
  fields: {
    firstname: { type: String, minLength: 2 },
    lastname: { type: String, minLength:2 },
    email: {
      type: Email,
      resolve(doc) { return doc.emails[0]},
      ui: { preventPaste: true }
    },
    emailConfirmation: {
      type: Email,
      confirm({doc,value}) { return doc.email === value },
      ui: { preventPaste: true }
    },
    password: { type: Password, ui: { preventPaste: true } },
    passwordConfirmation: {
      type: Password,
      confirm({doc,value}) { return doc.password === value },
      ui: { preventPaste: true }
    },
    language: { type: Languages },
    avatar: { type: Image, optional: true },
  }
})

const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: { type: Date, optional: true },
    emails: {
      type: [Email],
      default() { return []; }
    },
    profile: {
      type: UserProfile,
      default() { return {}; }
    }
  },
  helpers: {
    createUserFromClient(callback) {
      let user = new User(this.raw());
      delete user.profile.passwordConfirmation;
      delete user.profile.emailConfirmation;
      if (user.profile.password)
        user.profile.password = Accounts._hashPassword(user.profile.password);
      user.callMethod("createUser",callback)
      //Accounts.createUser(options,callback);
    }
  }
})

export default User;