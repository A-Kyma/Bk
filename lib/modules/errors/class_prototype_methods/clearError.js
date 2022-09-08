import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';
import _remove from 'lodash/remove';

function clearError(field) {
  if (!field)
    return this._errors.clear()

  return traverse(this,field,function(nestedDoc,nestedField,fieldDefinition) {
    let errors = nestedDoc._errors.get(nestedField);
    if (errors) {
      if (nestedField) {
        nestedDoc._errors.delete(nestedField);
      } else {
        nestedDoc._errors.clear();
      }
    }
  })
}

export default clearError;