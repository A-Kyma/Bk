import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {

  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {
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

          if (parsedDefinition.fields[fieldName] === undefined) parsedDefinition.fields[fieldName] = {}
          // It's only parsing, so we retrieve what we need
          parsedDefinition.fields[fieldName][permission] = fieldDefinition[permission];

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
        parsedDefinition.permissions[permission] = definition.permissions[permission]
      }

      if (Match.test(definition.permissions[permission], Function)) {
        parsedDefinition.permissions[permission].push(definition.permissions[permission]);
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
        parsedDefinition.permissions[permission] = definition[permission];
      }

      if (Match.test(definition[permission], Function)) {
        parsedDefinition.permissions[permission].push(definition[permission]);
      }
    }
  })
}

export default onParseDefinition;