import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";
import { Class } from "meteor/jagi:astronomy";

function canEdit(field) {
  let isNew = this.constructor.isNew(this);
  if (isNew) {
    return this.canCreate(field);
  } else {
    return this.canUpdate(field);
  }
}

export default canEdit;