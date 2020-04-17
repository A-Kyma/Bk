import _noop from 'lodash/noop';

/**
 * We initialize permission function so that we can have fields permission and class permissions
 */
function onInitSchema(schema, className) {
  let permissions = schema.permissions = {};
  permissions.canView = {fields:{}, class:[]};
  permissions.canUpdate = {fields:{}, class:[]};
  permissions.canCreate = {fields:{}, class:[]};
  permissions.canDelete = {fields:{}, class:[]};
};

export default onInitSchema;