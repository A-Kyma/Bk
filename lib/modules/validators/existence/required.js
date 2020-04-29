import { Validator } from 'meteor/jagi:astronomy';

//Required replaced since empty String is considered as a value
Validator.create({
  name: 'required',
  isValid({ value }) {
    if (typeof(value) === "string" && value==="") {
      return false;
    }
    return value !== null && value !== undefined;
  },
  resolveError({ name }) {
    return `"${name}" is required`;
  }
});