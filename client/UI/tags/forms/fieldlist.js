import './fieldlist.html';
import Bk from "../../../../lib/modules/core/utils/Bk";

Template.fieldList.helpers({
  fieldsArray() {
    return Bk.getFieldsArray(this);
  }
});

