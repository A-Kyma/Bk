import _each from 'lodash/each';
import _isEqual from 'lodash/isEqual'
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canUpdate(field,event,parent) {
  const doc=this;
  if (!this.constructor.schema.permissions.canUpdate) { return true ; }

  let bool = true;

  if (!field && event) {
    const oldDoc = event.oldDoc
    _each(this.getModified({fields: event.fields}), function (f) {
      if (doc.constructor.schema.permissions.canUpdate.fields[f]
      && !_isEqual(doc[f],oldDoc[f])) {
        bool = bool && doc.constructor.schema.permissions.canUpdate.fields[f]({
          doc,
          oldDoc,
          name: f,
          value: doc.get(f),
          oldValue: oldDoc.get(f),
          parent
        })
      }
    })
  }

  if (bool && field && isNestedFieldName(field)) {
    bool = bool && traverse(doc,field,function(nestedDoc, nestedName, fieldDefinition) {
      return nestedDoc.canUpdate && nestedDoc.canUpdate(nestedName,event,parent);
    })
  }

  if (bool && field && this.constructor.schema.permissions.canUpdate.fields[field]) {
    bool = bool && this.constructor.schema.permissions.canUpdate.fields[field]({doc, field, name:field, value: doc.get(field), parent})
  }

  _each(this.constructor.schema.permissions.canUpdate.class,function(f) {
    bool = bool && f({doc, field, name:field, value: doc.get(field), parent});
  })
  return bool;
}

export default canUpdate;