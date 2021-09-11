import _each from 'lodash/each';
import _noop from 'lodash/noop';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_each(sourceDefinition.fields, function(fieldDefinition, fieldName) {
	 	targetDefinition.fields[fieldName].label = fieldDefinition.label;
		targetDefinition.fields[fieldName].placeholder = fieldDefinition.placeholder;
	});
	return _noop;
};

export default onMergeDefinitions;