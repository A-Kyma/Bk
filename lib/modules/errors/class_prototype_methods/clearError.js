import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';
import _remove from 'lodash/remove';

function clearError(field) {
  let errors = this._errors.get();
  if (field) {
    errors = _remove(errors,function(e) { return e.name===field})
  } else {
    errors = [];
  }
  this._errors.set(errors);
}

export default clearError;