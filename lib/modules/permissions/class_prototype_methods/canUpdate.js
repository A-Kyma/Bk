import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canUpdate(field) {
  const doc=this;
  if (!this.constructor.schema.permissions.canUpdate) { return true ; }

  let bool = true;

  if (field && this.constructor.schema.permissions.canUpdate.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canUpdate.fields[field]({doc, name: field, value: doc.get(field)})
  }

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

  _each(this.constructor.schema.permissions.canUpdate.class,function(f) {
    bool = bool && f({doc, name: field, value: doc.get(field)});
    if (isNestedFieldName(field)) {
      bool = bool && traverse(doc,field,function(nestedDoc, nestedName, fieldDefinition) {
        return nestedDoc.canUpdate(nestedName);
      })
    }
  })
  return bool;
}

export default canUpdate;