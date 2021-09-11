import traverse from "../../core/utils/traverse";
import {Class as AstroClass} from "meteor/jagi:astronomy";

function getBelongsToRelations() {
  let result=[];

  // Traverse nested fields until reaching the last one from the pattern.
  let next = function(nestedDoc, nestedfield) {
    // Check if a nested document is an instance of the Astronomy class and get
    // a field object for a given field name;
    if (nestedDoc instanceof AstroClass) {
      // Get a class for of a nested document.
      let Class = nestedDoc.constructor;
      // Get fields in document
      let fields = Class.getFieldsNamesByFilter()

      fields.forEach(field => {
        let newNestedField = (nestedfield) ? nestedfield + "." + field : field
        if (typeof (nestedDoc[field + "Instance"]) === "function") {
          result.push(newNestedField)
        } else {
          next(nestedDoc[field], newNestedField)
        }
      })
    }
  };

  next(this);
  return result;
}

export default getBelongsToRelations;