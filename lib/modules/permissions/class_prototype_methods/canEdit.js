function canEdit(field, isNew) {
  if (isNew === undefined) {
    isNew = this.constructor.isNew(this);
  }

  if (isNew) {
    return this.canCreate(field);
  } else {
    return this.canUpdate(field);
  }
}

export default canEdit;