import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';
import { Validators } from 'meteor/jagi:astronomy';

function onParseDefinition(parsedDefinition, definition, className) {

	if (_has(definition,'defaultName')) {
    if (!Match.test(definition.defaultName, Function)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'defaultName'
      },
        'Property values has to be a function'
      ]);
    } else {
    	parsedDefinition.defaultName = definition.defaultName;
		}
		return;
	}

	if (definition.fields) {
		_each(definition.fields, (fieldDefinition, fieldName) => {
			if (_has(fieldDefinition,"defaultName")) {
        if (fieldDefinition.defaultName) {
          parsedDefinition.defaultName = fieldName;
        }
        return;
      }
		});
	}

};

export default onParseDefinition;