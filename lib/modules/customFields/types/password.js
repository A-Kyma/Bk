import { Type, Validators } from 'meteor/akyma:astronomy';
import Password from "../classes/Password";

Type.create({
  name: 'Password',
  class: Password,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args);
  }
});
