import { Type, Validators } from 'meteor/akyma:astronomy';
import TrimmedString from "../classes/TrimmedString";

Type.create({
  name: 'TrimmedString',
  class: TrimmedString,
  cast(value) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return String(value).trim();
  },
  validate(args) {
    Validators.string(args)
  }
});
