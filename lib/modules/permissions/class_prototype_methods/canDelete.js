import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canDelete(field) {
  const doc=this;
  if (!this.constructor.schema.permissions.canDelete) { return true ; }

  let bool = true;

  if (field && this.constructor.schema.permissions.canDelete.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canDelete.fields[field]({doc, name: field, value: doc.get(field)})
  }

  _each(this.constructor.schema.permissions.canDelete.class,function(f) {
    bool = bool && f({doc, name: field, value: doc.get(field)});
    if (isNestedFieldName(field)) {
      bool = bool && traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
        return nestedDoc.canDelete(nestedName);
      })
    }
  })
  return bool;
}

export default canDelete;