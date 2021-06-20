import _has from 'lodash/has';
import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition,function(fieldDefinition,fieldName) {
    if (fieldDefinition.label) {
      Class.schema.fields[fieldName].label = fieldDefinition.label;
    }
    if (fieldDefinition.placeholder) {
      Class.schema.fields[fieldName].placeholder = fieldDefinition.placeholder;
    }
  })

};

export default onApplyDefinition;