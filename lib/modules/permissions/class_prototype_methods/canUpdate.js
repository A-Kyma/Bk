import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canUpdate(field) {
  const doc=this;
  if (!this.constructor.schema.permissions.canUpdate) { return true ; }

  let bool = true;

  if (!field) {
    _each(this.getModified(), function (f) {
      if (doc.constructor.schema.permissions.canUpdate.fields[f]) {
        bool = bool && doc.constructor.schema.permissions.canUpdate.fields[f]({
          doc,
          name: f,
          value: doc.get(f)
        })
      }
    })
  }

  if (bool && field && isNestedFieldName(field)) {
    bool = bool && traverse(doc,field,function(nestedDoc, nestedName, fieldDefinition) {
      return nestedDoc.canUpdate && nestedDoc.canUpdate(nestedName);
    })
  }

  if (bool && field && this.constructor.schema.permissions.canUpdate.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canUpdate.fields[field]({doc, field, name:field, value: doc.get(field)})
  }

  _each(this.constructor.schema.permissions.canUpdate.class,function(f) {
    bool = bool && f({doc, field, name:field, value: doc.get(field)});
  })
  return bool;
}

export default canUpdate;