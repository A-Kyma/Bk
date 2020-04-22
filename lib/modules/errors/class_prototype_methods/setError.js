import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';
import { ValidationError } from 'meteor/jagi:astronomy';

function setError(errors) {
  if (ValidationError.is(errors)) {
    this._errors.set(errors.details);
  }
}

export default setError;