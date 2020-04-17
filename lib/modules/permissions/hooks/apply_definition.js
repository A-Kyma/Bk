import _each from 'lodash/each';
import _merge from 'lodash/merge';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {

    //We overwrite permission function for field
    _each(parsedDefinition.permissions[permission].fields, function(func,field) {
      Class.schema.permissions[permission].fields[field] = func;
    });

    //We append permission function for class
    _each(parsedDefinition.permissions[permission].class, function(func) {
      Class.schema.permissions[permission].class.push(func);
    })

  })
}

export default onApplyDefinition;