import {_} from "lodash";
import {Class} from 'meteor/jagi:astronomy';

const getFieldsArray = function (options) {
  let fields = [];
  let exclude = [];
  let model = Class.getModel(options.model);
  if (options.fields) {
    if (Array.isArray(options.fields)) {
      return options.fields;
    } else {
      return options.fields.replace(RegExp(" ", "g"), "").split(",");
    }
  }
  if (typeof model === "function") {
    fields = model.getFieldsNames();
  } else {
    fields = model.constructor.getFieldsNames();
  }

  if ((options.exclude) && (typeof(options.exclude) === "string")) {
    exclude = options.exclude.replace(RegExp(" ", "g"), "").split(",");
  }
  // Always exclude "_id" in a fieldList
  exclude.push("_id");
  return _.difference(fields, exclude);
}

export default getFieldsArray;