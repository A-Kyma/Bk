import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import { Type, Validators } from 'meteor/akyma:astronomy';

Type.create({
  name: 'Date',
  class: Date,
  cast(value) {
    let castedDate = value
    if (_isNumber(value)) {
      castedDate = new Date(value);
    }
    else if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
      }
      else if (/^[0-9]+$/.test(value)) {
        castedDate = new Date(parseInt(value, 10));
      }
      /* In order to use European format */
      else if (/^[0-9]{2}[-\/][0-9]{2}[-\/][0-9]{2}$/.test(value)) {
        const year=new Date().getFullYear().toString()
        const dateInternal = year.substring(0,2) + value.substring(6) + "-" + value.substring(3,5) + "-" + value.substring(0,2)
        castedDate = new Date(dateInternal)
      }
      else if (/^[0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4}$/.test(value)) {
        let dateInternal = value.substring(6) + "-" + value.substring(3,5) + "-" + value.substring(0,2)
        castedDate = new Date(dateInternal)
      }
      else {
        const time = Date.parse(value);
        if (!_isNaN(time)) {
          castedDate = new Date(time);
        }
      }
    }
    if (castedDate instanceof Date) {
      let t = castedDate.getTime()
      t = t - (t%86400000)
      castedDate = new Date(t)
    }
    return castedDate;
  },
  validate(args) {
    Validators.date(args);
  }
});