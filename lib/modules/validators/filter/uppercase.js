import {Validator} from "meteor/jagi:astronomy";

Validator.create({
  name: 'uppercase',
  isValid({ doc, name, nestedName, value }) {
    const isString = value => typeof value === 'string' || value instanceof String;

    if (!isString(value)) {
      return false;
    }
    doc[name] = value.toUpperCase();

    return true;
  },
  resolveError({ name }) {
    return `"${name}" must be a string`;
  }
});