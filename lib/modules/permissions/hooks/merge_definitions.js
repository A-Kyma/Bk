import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_each(["canView", "canUpdate", "canCreate", "canDelete"], function (permission) {

		//We overwrite permission function for field
		_each(sourceDefinition.fields, function (fieldDefinition, field) {
			if (fieldDefinition[permission])
				targetDefinition.fields[field][permission] = fieldDefinition[permission];
		})
	})

	_each(sourceDefinition.permissions, function(permissionDefinition, permission) {
		// We extend classes permissions
		if (Array.isArray(targetDefinition.permissions[permission])) {
			targetDefinition.permissions[permission]=targetDefinition.permissions[permission].concat(permissionDefinition)
		} else {
			let result = []
			if (targetDefinition.permissions[permission] !== undefined)
				result.push(targetDefinition.permissions[permission])
			result.push(permissionDefinition)
			targetDefinition.permissions[permission]=result
		}
	});
}

export default onMergeDefinitions;