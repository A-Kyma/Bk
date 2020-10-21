import { Class as AstroClass } from "meteor/jagi:astronomy";
import { ObjectField, ListField } from "meteor/jagi:astronomy";
import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  _each(schema.fields, function(fieldDefinition, fieldName) {
    if (fieldDefinition.type instanceof AstroClass) {
      let RelationClass = fieldDefinition.type;
      fieldDefinition.relation = true;

      if (fieldDefinition.type.getCollection()) {
        let helperName = fieldName + "Available"
        let f = function() { return undefined };
        schema.helper[helperName] = f;
        RelationClass.prototype[helperName] = f;
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