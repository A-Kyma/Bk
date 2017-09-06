import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';
import { Validators, reservedKeywords } from 'meteor/jagi:astronomy';

const typePattern = Match.OneOf(Function, [Function]);

function onParseDefinition(parsedDefinition, definition, className) {
   // Check existence and validity of the "relations" property.
  if (definition.relations !== undefined) {
    if (!Match.test(definition.relations, Object)) {
      throwParseError([{
          'class': className
        }, {
          'property': 'relations'
        },
        'Helpers definition has to be an object'
      ]);
    }

    _each(definition.relations, function(relationDefinition, relationName) {
      if (Match.test(relationDefinition, typePattern)) {
        relationDefinition = {
          name: relationName,
          type: relationDefinition
        };
      }
      else if (Match.test(relationDefinition, Object)) {
        relationDefinition = _extend(relationDefinition, {
          name: relationName
        });
      }
      else {
        throwParseError([{
          'class': className
        }, {
          'property': 'relations'
        }, {
          'field': relationName
        },
          'Relation definition has to be an object or type'
        ]);
      }

      if (_includes(reservedKeywords, relationName)) {
        throwParseError([{
            'class': className
          }, {
            'relation': relationName
          },
          'Reserved keyword'
        ]);
      }
      parsedDefinition.relations[relationName] = relationDefinition;
    });
  }
};

export default onParseDefinition;