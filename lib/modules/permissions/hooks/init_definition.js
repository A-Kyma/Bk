import _noop from 'lodash/noop';

/**
 * We initialize permission function so that we can have fields permission and class permissions
 */
function onInitDefinition(definition, className) {
  definition.canView = {fields:{}, class:[]};
  definition.canUpdate = {fields:{}, class:[]};
  definition.canCreate = {fields:{}, class:[]};
  definition.canDelete = {fields:{}, class:[]};
};

export default onInitDefinition;