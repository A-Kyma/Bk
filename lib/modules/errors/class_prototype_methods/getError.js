import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';

function getError(field) {
  let errors = this._errors.get();
  if (field) {
    return _find(errors,function(e) { return e.name===field})
  } else {
    return errors;
  }

}

export default getError;