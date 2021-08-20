import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import { Type, Validators } from 'meteor/jagi:astronomy';
import DateTime from "../classes/DateTime";

Type.create({
  name: 'DateTime',
  class: DateTime,
  cast(value) {
    if (_isNumber(value)) {
      return new Date(value);
    }
    else if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
      }
      else if (/^[0-9]+$/.test(value)) {
        return new Date(parseInt(value, 10));
      }
      else {
        const time = Date.parse(value);
        if (!_isNaN(time)) {
          return new Date(time);
        }
      }
    }
    return value;
  },
  validate(args) {
    Validators.date(args);
  }
});