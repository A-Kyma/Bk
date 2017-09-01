import { Type, Validators } from 'meteor/jagi:astronomy';
import Email from '../classes/Email.js';

Type.create({
  name: 'Email',
  class: Email,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args);
    Validators.email(args)
  }
});
