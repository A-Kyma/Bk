import _each from 'lodash/each';
import {Class} from "meteor/akyma:astronomy";

import cloneDefinition from "../../core/utils/cloneDefinition";

const typePattern = Match.OneOf(Function, [Function]);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.fields === undefined) {
    return;
  }

  _each(definition.fields, function(fieldDefinition, fieldName) {

    let typeClass
    if (Match.test(fieldDefinition.type, Array)) {
      typeClass = fieldDefinition.type[0]
    } else {
      typeClass= fieldDefinition.type
    }
    if (Class.includes(typeClass)
      && typeClass.getCollection()) {
      let relationDefinition = cloneDefinition(fieldDefinition);
      relationDefinition.relation = typeClass;

      // If relation is cached, then all of it is copied in this class
      if (fieldDefinition.cache) {
        // Check for has many relations.
        if (Match.test(fieldDefinition.type, Array)) {
          // We keep the _id's in the schema, not the entire classes
          relationDefinition.type = [Object]; // Which will be the cached Objects
        }
        // Check for belongs_to relations
        else {
          // We keep the _id in the schema, not the entire class
          relationDefinition.type = Object; // Which will be the cached Object
        }
      } else {
        // Check for has many relations.
        if (Match.test(fieldDefinition.type, Array)) {
          // We keep the _id's in the schema, not the entire classes
          relationDefinition.type = [String]; // Which will be an array of Mongo ID
        }
        // Check for belongs_to relations
        else {
          // We keep the _id in the schema, not the entire class
          relationDefinition.type = String; // Which will be a Mongo ID
        }
      }
      parsedDefinition[fieldName] = relationDefinition
    }
  });

};

export default onParseDefinition;