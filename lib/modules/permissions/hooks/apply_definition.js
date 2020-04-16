import _each from 'lodash/each';
import _merge from 'lodash/merge';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {

    //We overwrite permission function for field
    _each(parsedDefinition[permission].fields, function(func,field) {
      Class.schema[permission].fields[field] = func;
    });

    //We append permission function for class
    _each(parsedDefinition[permission].class, function(func) {
      Class.schema[permission].class.push(func);
    })

    //TODO add event before Save / beforeDelete / beforeCreate ?
  })
}

export default onApplyDefinition;