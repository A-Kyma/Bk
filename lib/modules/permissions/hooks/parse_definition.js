import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {

  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {
    // We retrieve earlier permission definition in class.definition.permissions as default
    /* NOT NEEDED since it's an extend
    if (definition.permissions && definition.permissions[permission]) {
      let permissionDefinition=definition.permissions[permission]
      parsedDefinition.permissions[permission].class=permissionDefinition;

      // We overwrite specific field permissions
      _each(permissionDefinition.fields, function(fieldPermissionDefinition, field) {
        parsedDefinition.permissions[permission].fields[field] = fieldPermissionDefinition.class;
      })
    }
     */

    // We retrieve field permission. (canView at field level for example)
    if (definition.fields) {
      _each(definition.fields, function (fieldDefinition, fieldName) {
        if (_has(fieldDefinition, permission)) {
          if (!Match.test(fieldDefinition[permission], Function)) {
            throwParseError([{
              'class': className
            }, {
              'field': fieldName
            }, {
              'property': permission
            },
              'Property values has to be a function'
            ]);
          }

          parsedDefinition.permissions[permission].fields[fieldName] = fieldDefinition[permission];

        }
      });
    }

    // We retrieve class permission which can be a function or an array
    // defined in group "permissions" of the class definition
    if (definition.permissions && definition.permissions[permission]) {
      if (!Match.test(definition.permissions[permission], Function)
        && !Match.test(definition.permissions[permission], Array) ) {
        throwParseError([{
          'class': className
        }, {
          'property': permission
        },
          'Property values has to be an array or a function'
        ]);
      }

      if (Match.test(definition.permissions[permission], Array)) {
        _each(definition.permissions[permission], function(permissionFunction) {
          parsedDefinition.permissions[permission].class.push(permissionFunction);
        })
      }

      if (Match.test(definition.permissions[permission], Function)) {
        parsedDefinition.permissions[permission].class.push(definition.permissions[permission]);
      }

    }
    // We retrieve class permission which can be a function or an array
    // Defined directly as canXXXX in the class definition
    if (definition[permission]) {
      if (!Match.test(definition[permission], Function)
      && !Match.test(definition[permission], Array) ) {
        throwParseError([{
          'class': className
        }, {
          'property': permission
        },
          'Property values has to be an array or a function'
        ]);
      }

      if (Match.test(definition[permission], Array)) {
        _each(definition[permission], function(permissionFunction) {
          parsedDefinition.permissions[permission].class.push(permissionFunction);
        })
      }

      if (Match.test(definition[permission], Function)) {
        parsedDefinition.permissions[permission].class.push(definition[permission]);
      }
    }
  })
}

export default onParseDefinition;