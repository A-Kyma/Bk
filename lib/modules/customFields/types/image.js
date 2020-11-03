import { Type, Validators } from 'meteor/jagi:astronomy';
import Image from "../classes/Image";

Type.create({
  name: 'Image',
  class: Image,
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
