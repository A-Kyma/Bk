import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';
import { Validators } from 'meteor/jagi:astronomy';

function onParseDefinition(parsedDefinition, definition, className) {

	if (definition.fields) {
		_each(definition.fields, (fieldDefinition, fieldName) => {
      parsedDefinition[fieldName] = {};
			if (_has(fieldDefinition,"label")) {
        if (!Match.test(fieldDefinition.label, String)) {
          throwParseError([{
            'class': className
          }, {
            'field': fieldName
          }, {
            'property': 'label'
          },
            'Property value has to be a string'
          ]);
        }
      }
			else {
        parsedDefinition[fieldName].label = className + "." + fieldName + ".label";
      }

      if (_has(fieldDefinition,"placeholder")) {
        if (!Match.test(fieldDefinition.placeholder, String)) {
          throwParseError([{
            'class': className
          }, {
            'field': fieldName
          }, {
            'property': 'placeholder'
          },
            'Property value has to be a string'
          ]);
        }
      }
      else {
        parsedDefinition[fieldName].placeholder = className + "." + fieldName + ".placeholder";
      }

		})
	}

};

export default onParseDefinition;