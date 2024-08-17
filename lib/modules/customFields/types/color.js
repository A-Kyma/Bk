import { Type, Validators } from 'meteor/akyma:astronomy';
import Color from "../classes/Color";

Type.create({
  name: 'Color',
  class: Color,
  cast(value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }
    return String(value);
  },
  validate(args) {
    Validators.string(args);
    Validators.regexp({...args,param: /^#[0-9a-z]{6}$/})
  }
});
