import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canCreate(field,event) {
  const doc=this;
  if (!this.constructor.schema.permissions.canCreate) { return true ; }

  let bool = true;

  if (field && isNestedFieldName(field)) {
    bool = bool && traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
      return nestedDoc.canCreate && nestedDoc.canCreate(nestedName);
    })
  }

  if (bool && field && this.constructor.schema.permissions.canCreate.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canCreate.fields[field]({doc, field, name:field, value: doc.get(field)})
  }

  _each(this.constructor.schema.permissions.canCreate.class,function(f) {
    bool = bool && f({doc, field, name:field, value: doc.get(field)});
  })
  return bool;
}

export default canCreate;