import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
  name: 'hex',
  isValid({ doc, name, value, param }) {
    let number = parseInt(value,16) // conversion of hex in number
    if (isNaN(number)) return false
    let hex = number.toString(16) // conversion of number into hex
    return value.toLowerCase() === hex.toLowerCase()
  },
  resolveError({ name, value }) {
    return `Hexadecimal number ${value} is not valid`;
  }
});