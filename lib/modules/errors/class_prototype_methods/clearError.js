import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';
import _remove from 'lodash/remove';

function clearError(field) {
  let errors = this.getError(field);
  if (errors) {
    if (field) {
      this._errors.delete(field);
    } else {
      this._errors.clear();
    }
  }
}

export default clearError;