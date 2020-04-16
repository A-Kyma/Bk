import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {

  _each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {
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

          parsedDefinition[permission].fields[fieldName] = fieldDefinition[permission];
          fieldDefinition[permission] = undefined;

        }
      });
    }

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
          parsedDefinition[permission].class.push(permissionFunction);
        })

      }

      if (Match.test(definition[permission], Function)) {
        parsedDefinition[permission].class.push(definition[permission]);
      }
    }
  })
}

export default onParseDefinition;