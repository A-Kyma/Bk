import { Type, Validators } from 'meteor/jagi:astronomy';
import TextEditor from "../classes/TextEditor";

Type.create({
  name: 'TextEditor',
  class: TextEditor,
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
