import _isObject from 'lodash/isObject';
import { Type, Validators } from 'meteor/jagi:astronomy';
import Url from "../classes/Url";

Type.create({
  name: 'Url',
  class: Url,
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
    Validators.String(args);
    Validators.regexp({...args,param: /^[\w+\.]+\.[a-zA-Z]{2,}$/ })
  }
});
