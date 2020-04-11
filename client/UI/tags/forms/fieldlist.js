import './fieldlist.html';

Template.fieldList.helpers({
  fieldsArray() {
    return BkCore.getFieldsArray(this);
  }
});

