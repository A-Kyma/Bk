import {Class} from 'meteor/jagi:astronomy';
import {User} from "./user";
import DateTime from "../modules/customFields/classes/DateTime";

const Meta = Class.create({
  name: "Meta",
  fields: {
    createdAt: {
      type: DateTime,
      immutable: true,
      optional: true
    },
    updatedAt: {
      type: DateTime,
      optional: true
    },
    createUser: {
      type: User,
      immutable: true,
      optional: true
    },
    updateUser: {
      type: User,
      optional: true
    },
    timeZone: {
      type: String,
      optional: true
    }
  },
});

export default Meta;


