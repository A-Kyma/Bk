import { Type, Validators } from 'meteor/akyma:astronomy';
import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';
import _isObject from 'lodash/isObject';
import Hex from '../classes/Hex'

Type.create({
  name: 'Hex',
  class: Hex,
  cast(value) {
    if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return undefined;
        }
        else {
          return "0";
        }
      }
      value = value.toLowerCase()
    }
    return value
  },
  validate(args) {
    Validators.string(args);
    Validators.regexp({...args,param: /^[0-9a-fA-F]+$/})
  }
});
