import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canView(field,event,parent) {
  const doc=this;
  if (!this.constructor.schema.permissions.canView) { return true ; }

  let bool = true;

  if (field && this.constructor.schema.permissions.canView.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canView.fields[field]({doc, field, name: field, value: doc.get(field),parent})
  }

  _each(this.constructor.schema.permissions.canView.class,function(f) {
    bool = bool && f({doc, field, value: doc.get(field), parent});
    if (bool && isNestedFieldName(field)) {
      bool = bool && traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
        return nestedDoc.canView(nestedName,undefined,parent);
      })
    }
  })
  return bool;
}

export default canView;