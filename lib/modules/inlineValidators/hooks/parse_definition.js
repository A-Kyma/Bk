import _each from 'lodash/each';
import _has from 'lodash/has';
import _concat from 'lodash/concat';
import _defaultTo from 'lodash/defaultTo';
import throwParseError from '../../core/utils/throw_parse_error.js';
import { Validators } from 'meteor/jagi:astronomy';

function onParseDefinition(parsedDefinition, definition, className) {

	if (definition.fields) {
		_each(definition.fields, (fieldDefinition, fieldName) => {
			_each(fieldDefinition, (param, validatorType) => {
				if (_has(Validators, validatorType)) {
					fieldDefinition.validators = _defaultTo(fieldDefinition.validators,new Array);
          fieldDefinition.validators.push({ type: validatorType, param: param});
				}
			});
      if (_has(fieldDefinition, 'validators')) {
        parsedDefinition.validators[fieldName] = fieldDefinition.validators;
        fieldDefinition.validators = undefined;
      }
		})
	}
};

export default onParseDefinition;