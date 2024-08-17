import _isObject from 'lodash/isObject';
import { Type, Validators } from 'meteor/akyma:astronomy';
import Domain from "../classes/Domain";


Type.create({
  name: 'Domain',
  class: Domain,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value.toLowerCase();
    }
    return String(value).toLowerCase();
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
    if (Meteor.isDevelopment)
      Validators.regexp({...args,param: /^[\w+\.-:]+$/ })
    if (Meteor.isProduction)
      Validators.regexp({...args,param: /^[\w+\.-]+\.[a-zA-Z]{2,}$/ })
  }
});
