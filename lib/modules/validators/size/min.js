import _has from 'lodash/has';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
  name: 'min',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "min" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    if (!_has(value, 'length')) {
      return false;
    }
    return value.length >= param;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be at least ${param}`;
  }
});