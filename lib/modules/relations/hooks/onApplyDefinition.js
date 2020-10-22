import {Class as AstroClass, ListField} from "meteor/jagi:astronomy";
import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  _each(schema.fields, function(fieldDefinition, fieldName) {
    let RelationClass = fieldDefinition.type.class;
    if (AstroClass.includes(RelationClass)) {
      if (RelationClass.getCollection()) {
        fieldDefinition.relation = true;
        let helperName = fieldName + "Available"
        let f = function() { return undefined };
        let helpers = {}
        helpers[helperName] = f
        Class.extend({
          helpers,
        }, ["helpers"]);
      }

      if (fieldDefinition instanceof ListField) {

      }
    }
  });


  // Add helpers to the class.
  _each(parsedDefinition.relations, (relationDefinition, relationName) => {
    schema.helpers[relationName] = relationDefinition;
    Class.prototype[relationName] = undefined; // TODO
  });
};

export default onApplyDefinition;