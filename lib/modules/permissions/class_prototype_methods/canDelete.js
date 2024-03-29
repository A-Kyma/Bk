import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canDelete(field,event,parent) {
  const doc=this;
  if (!this.constructor.schema.permissions.canDelete) { return true ; }

  let bool = true;

  if (field && this.constructor.schema.permissions.canDelete.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canDelete.fields[field]({doc, field, name: field, value: doc.get(field), parent})
  }

  _each(this.constructor.schema.permissions.canDelete.class,function(f) {
    bool = bool && f({doc, field, value: doc.get(field), parent});
    if (bool && isNestedFieldName(field)) {
      bool = bool && traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
        return nestedDoc.canDelete(nestedName, undefined, parent);
      })
    }
  })
  return bool;
}

export default canDelete;