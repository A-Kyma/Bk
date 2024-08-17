import _isObject from 'lodash/isObject';
import { Type, Validators } from 'meteor/akyma:astronomy';
import Time from "../classes/Time";

Type.create({
  name: 'Time',
  class: Time,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  /*
        doc,
        name,
        nestedName,
        value,
        param,
        resolveParam,
        message,
        resolveError
   */
  validate(args) {
    Validators.string(args);
    Validators.regexp({...args,param: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\.[0-9][0-9][0-9])?)?$/ })
  }
});
