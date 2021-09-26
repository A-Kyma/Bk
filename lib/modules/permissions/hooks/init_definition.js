import _noop from 'lodash/noop';

/**
 * We initialize permission function so that we can have fields permission and class permissions
 * We Store only class definitions in definition.permissions. Fields permissions stays at fields level
 * Initialization of parsedDefinition and Class definition
 */
function onInitDefinition(definition, className) {
  definition.fields = {}
  let permissions = definition.permissions = {};
  permissions.canView = []
  permissions.canUpdate = []
  permissions.canCreate = []
  permissions.canDelete = []
};

export default onInitDefinition;