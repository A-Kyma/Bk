import {Validator} from "meteor/jagi:astronomy";

Validator.create({
  name: 'capitalize',
  isValid({ doc, name, nestedName, value }) {
    const isString = value => typeof value === 'string' || value instanceof String;

    if (!isString(value)) {
      return false;
    }
    doc[name] = value.charAt(0).toUpperCase() + value.slice(1);

    return true;
  },
  resolveError({ name }) {
    return `"${name}" must be a string`;
  }
});