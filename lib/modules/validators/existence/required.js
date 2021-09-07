import {Class, Validator} from 'meteor/jagi:astronomy';

//Required replaced since empty String is considered as a value
//We also added requirement validator for external relation
Validator.create({
  name: 'required',
  isValid({ value }) {
    if (typeof(value) === "string" && value==="") {
      return false;
    }
    if (value instanceof Class) {
      if (value.constructor.getCollection() && value._id === undefined) {
        return false;
      }
    }
    if (Array.isArray(value) && value.length === 0) {
      return false
    }
    return value !== null && value !== undefined;
  },
  resolveError({ name }) {
    return `"${name}" is required`;
  }
});