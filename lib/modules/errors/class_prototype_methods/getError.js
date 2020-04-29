import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';

function getError(field) {
  if (!field) {
    return this._errors.all();
  }

  return traverse(this,field,function(nestedDoc,nestedField,fieldDefinition) {
    return nestedDoc._errors.get(nestedField);
  })
}

export default getError;