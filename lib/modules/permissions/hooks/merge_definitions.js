import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_each(sourceDefinition.permissions, function(permissionDefinition, permission) {
		// We extend classes permissions
		targetDefinition.permissions[permission].class.concat(permissionDefinition.class)

		// We overwrite specific field permissions
		_each(permissionDefinition.fields, function(fieldPermissionDefinition, field) {
			targetDefinition.permissions[permission].fields[field] = fieldPermissionDefinition;
		})
	});
};

export default onMergeDefinitions;