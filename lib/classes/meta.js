import {Class} from 'meteor/jagi:astronomy';
import {User} from "./user";

const Meta = Class.create({
  name: "Meta",
  fields: {
    createdAt: {
      type: Date,
      immutable: true,
      optional: true
    },
    updatedAt: {
      type: Date,
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
    }
  },
});

export default Meta;


