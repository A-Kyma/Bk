import _each from 'lodash/each';
import _merge from 'lodash/merge';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {

    //We overwrite permission function for field
    _each(parsedDefinition.fields, function(fieldDefinition,field) {
      if (fieldDefinition[permission])
        Class.schema.permissions[permission].fields[field] = fieldDefinition[permission];
    })

    //We append permission function for class
    _each(parsedDefinition.permissions[permission], function(permissions) {
      if (Array.isArray(permissions))
        permissions.forEach(func => Class.schema.permissions[permission].class.push(func))
    })
  })
}

export default onApplyDefinition;