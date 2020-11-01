import _each from 'lodash/each';
import {Class} from "meteor/jagi:astronomy";

import cloneDefinition from "../../core/utils/cloneDefinition";

const typePattern = Match.OneOf(Function, [Function]);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.fields === undefined) {
    return;
  }

  _each(definition.fields, function(fieldDefinition, fieldName) {

    if (Class.includes(fieldDefinition.type)
      && fieldDefinition.type.getCollection()) {
      // Check for has many relations.
      if (Match.test(fieldDefinition.type, Array)) {

      }
      // Check for belongs_to relations
      else {
        // We keep the _id in the schema, not the entire class
        let relationDefinition = cloneDefinition(fieldDefinition);
        relationDefinition.relation = fieldDefinition.type;
        relationDefinition.type = String; // Which will be a Mongo ID
        parsedDefinition[fieldName] = relationDefinition
      }
    }
  });

};

export default onParseDefinition;