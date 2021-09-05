import _isObject from 'lodash/isObject';
import { Type, Validators } from 'meteor/jagi:astronomy';
import Domain from "../classes/Domain";


Type.create({
  name: 'Domain',
  class: Domain,
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
    Validators.regexp({...args,param: /^[\w+\.-]+\.[a-zA-Z]{2,}$/ })
  }
});
