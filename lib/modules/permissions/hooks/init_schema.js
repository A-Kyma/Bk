import _noop from 'lodash/noop';

/**
 * We initialize permission function so that we can have fields permission and class permissions
 */
function onInitSchema(schema, className) {
  schema.canView = {fields:{}, class:[]};
  schema.canUpdate = {fields:{}, class:[]};
  schema.canCreate = {fields:{}, class:[]};
  schema.canDelete = {fields:{}, class:[]};
};

export default onInitSchema;