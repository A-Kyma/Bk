import _each from 'lodash/each';
import { ObjectField, ListField } from 'meteor/jagi:astronomy';
import Lifecycle from "../customs/Lifecycle";

function onApplyDefinition(Class, parsedDefinition, className) {
  /***
   * Add default for:
   * Array : default() { return [] }
   * Object : default() { return {} }
   * Boolean (if optional) : default: false
   * Lifecycle : default: _inialValue_of_the_lifecycle_
   ***/
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
      // if Boolean, we create default value : False if mandatory. undefined if optional
      if (fieldDefinition.type.class === Boolean
      && !fieldDefinition.optional) {
        fieldDefinition.default = false;
      }
      // if Lifecycle, we create default value
      if (fieldDefinition.type.class.name === "Lifecycle") {
        let lifecycle = fieldDefinition.type.class;
        fieldDefinition.default = lifecycle.getDefault();
      }
    }
  })
};

export default onApplyDefinition;