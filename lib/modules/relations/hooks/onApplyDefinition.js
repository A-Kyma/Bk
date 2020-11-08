import {Class as AstroClass} from "meteor/jagi:astronomy";
import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition,function(fieldDefinition,fieldName) {

    let available = function() { return undefined };

    let instanciate = function() {
      if (this[fieldName]) {
        return fieldDefinition.relation.findOne(this[fieldName]);
      } else {
        return new (fieldDefinition.relation) ();
      }
    }

    Class.extend({
      fields: {
        [fieldName]: fieldDefinition
      },
      helpers: {
        [fieldName + "Available"]: available,
        [fieldName + "Instance"]: instanciate,
      }
    });




  })
};

export default onApplyDefinition;