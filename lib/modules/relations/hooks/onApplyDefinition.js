import {Class as AstroClass} from "meteor/jagi:astronomy";
import _each from 'lodash/each';



function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition,function(fieldDefinition,fieldName) {

    function available() { return undefined };

    function instanciate() {
      if (this[fieldName]) {
        return fieldDefinition.relation.findOne(this[fieldName]);
      } else {
        return new (fieldDefinition.relation) ();
      }
    }

    function instanciates() {
      if (this[fieldName]) {
        return fieldDefinition.relation.find(this[fieldName]);
      } else {
        return [new (fieldDefinition.relation) ()];
      }
    }

    if (Array.isArray(fieldDefinition.type)) {
      // has_many relation
      Class.extend({
        fields: {
          [fieldName]: fieldDefinition
        },
        helpers: {
          [fieldName + "Available"]: available,
          [fieldName + "Instances"]: instanciates,
        }
      })
    } else {
      // belongs_to relation
      Class.extend({
        fields: {
          [fieldName]: fieldDefinition
        },
        helpers: {
          [fieldName + "Available"]: available,
          [fieldName + "Instance"]: instanciate,
        }
      })
    }



  })
};

export default onApplyDefinition;