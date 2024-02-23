function canEdit(field, isNew, parent) {
  if (isNew === undefined) {
    isNew = this.constructor.isNew(this);
  }

  if (isNew) {
    return this.canCreate(field, undefined, parent);
  } else {
    return this.canUpdate(field, undefined, parent);
  }
}

export default canEdit;