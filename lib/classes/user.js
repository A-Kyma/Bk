import { Class } from 'meteor/jagi:astronomy'
import Email from "../modules/customFields/classes/Email";
import Password from "../modules/customFields/classes/Password";
import Languages from "../modules/customFields/types/language";
import Image from "../modules/customFields/classes/Image";

const User = Class.create({
  name: 'User',
  collection: 'users',
  fields: {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: Email },
    emailConfirmation: { type: Email, transient: true },
    password: { type: Password },
    passwordConfirmation: { type: Password, transient: true },
    language: { type: Languages },
    avatar: { type: Image, optional: true },
  }
})