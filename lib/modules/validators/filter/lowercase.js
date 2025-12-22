import {Validator} from "meteor/akyma:astronomy";

Validator.create({
  name: 'lowercase',
  isValid({ doc, name, nestedName, value }) {
    const isString = value => typeof value === 'string' || value instanceof String;

    if (!isString(value)) {
      return false;
    }
    doc[name] = value.toLowerCase();

    return true;
  },
  resolveError({ name }) {
    return `"${name}" must be a string`;
  }
});