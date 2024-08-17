import { Type, Validators } from 'meteor/akyma:astronomy';
import Email from '../classes/Email.js';

Type.create({
  name: 'Email',
  class: Email,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value.toLowerCase();
    }
    return String(value).toLowerCase();
  },
  validate(args) {
    Validators.string(args);
    Validators.email(args)
  }
});
