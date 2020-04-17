import _each from 'lodash/each';

function canView(field) {
  if (!this.schema.permissions.canView) { return true ; }

  let bool;

  if (field && this.schema.permissions.canView.fields[field]) {
    bool = this.schema.permissions.canView.fields[field]({})
  }
}

export default canView;