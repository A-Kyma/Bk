import { Type, Validators } from 'meteor/jagi:astronomy';
import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import _isObject from 'lodash/isObject';
import Percentage from "../classes/Percentage";

Type.create({
  name: 'Percentage',
  class: Percentage,
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
  }
});
