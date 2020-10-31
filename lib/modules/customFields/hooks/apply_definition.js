import _each from 'lodash/each';
import { ObjectField, ListField } from 'meteor/jagi:astronomy';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(Class.schema.fields,(fieldDefinition, fieldName) => {
    if (!fieldDefinition.default) {
      // if object (like subclass), we create default empty object : {}
      if (fieldDefinition instanceof ObjectField) {
         fieldDefinition.default = function() { return {}};
      }
      // if array of anything, we create default array : []
      if (fieldDefinition instanceof ListField) {
        fieldDefinition.default = function() { return []};
      }
      // if Boolean, we create default value : False
      if (fieldDefinition.type.class === Boolean) {
        fieldDefinition.default = false;
      }
    }
  })
};

export default onApplyDefinition;