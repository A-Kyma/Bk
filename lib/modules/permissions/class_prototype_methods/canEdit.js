import _each from 'lodash/each';
import isNestedFieldName from "../../core/utils/isNestedFieldName";
import traverse from "../../core/utils/traverse";

function canEdit(field) {
  return this.canCreate(field) && this.canUpdate(field);
}

export default canEdit;