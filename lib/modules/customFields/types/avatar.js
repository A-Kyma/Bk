import { Type, Validators } from 'meteor/jagi:astronomy';
import Avatar from "../classes/Avatar";

Type.create({
  name: 'Avatar',
  class: Avatar,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args)
  }
});
