import { Type, Validators } from 'meteor/akyma:astronomy';
import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import _isObject from 'lodash/isObject';
import Integer from "../classes/Integer";

Type.create({
  name: 'Integer',
  class: Integer,
  cast(value) {
    if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return undefined;
        }
        else {
          return 0;
        }
      }
    }
    else if (_isObject(value)) {
      return value;
    }
    else if (!_isNaN(value) && _isNumber(value)) {
      return value;
    }
    const number = Number(value);
    return !_isNaN(number) ? number : value;
  },
  validate(args) {
    Validators.number(args);
    Validators.integer(args);
  }
});
