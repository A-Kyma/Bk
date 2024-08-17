import _isObject from 'lodash/isObject';
import { Type, Validators } from 'meteor/akyma:astronomy';
import Phone from "../classes/Phone";

Type.create({
  name: 'Phone',
  class: Phone,
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
    Validators.regexp({...args,param: /^[0-9+-\.\(\)\/\s]{8,}$/ })
  }
});
