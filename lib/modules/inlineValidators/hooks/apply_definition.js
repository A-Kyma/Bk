import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition.validators, function(validators, fieldName) {
    Class.schema.validators[fieldName] =
      Class.schema.validators[fieldName] || [];
    _each(validators, function(validator) {
      Class.schema.validators[fieldName] =
        Class.schema.validators[fieldName].concat(validator);
    });
  });
};

export default onApplyDefinition;