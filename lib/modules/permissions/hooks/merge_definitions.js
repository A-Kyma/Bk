import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	const targetFields = targetDefinition.fields || {};
	const sourceFields = sourceDefinition.fields || {};
	const targetPermissions = targetDefinition.permissions || {};
	const sourcePermissions = sourceDefinition.permissions || {};

	_each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {
		// We overwrite permission function for field when defined in the source
		_each(sourceFields, function (fieldDefinition = {}, field) {
			if (!fieldDefinition[permission]) return;
			targetFields[field] = targetFields[field] || {};
			targetFields[field][permission] = fieldDefinition[permission];
		})
	})

	_each(sourcePermissions, function(permissionDefinition, permission) {
		// We extend classes permissions
		if (Array.isArray(targetPermissions[permission])) {
			targetPermissions[permission]=targetPermissions[permission].concat(permissionDefinition)
		} else {
			let result = []
			if (targetPermissions[permission] !== undefined)
				result.push(targetPermissions[permission])
			result.push(permissionDefinition)
			targetPermissions[permission]=result
		}
	});

	targetDefinition.fields = targetFields;
	targetDefinition.permissions = targetPermissions;
}

export default onMergeDefinitions;