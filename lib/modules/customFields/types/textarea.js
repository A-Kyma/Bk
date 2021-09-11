import { Type, Validators } from 'meteor/jagi:astronomy';
import Textarea from "../classes/Textarea";

Type.create({
  name: 'Textarea',
  class: Textarea,
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
