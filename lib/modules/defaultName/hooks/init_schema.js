import _noop from 'lodash/noop';

function onInitSchema(schema, className) {
  schema.defaultName = _noop;
};

export default onInitSchema;