import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  // Add helpers to the class.
  _each(parsedDefinition.relations, (relationDefinition, relationName) => {
    schema.helpers[relationName] = relationDefinition;
    Class.prototype[relationName] = undefined; // TODO
  });
};

export default onApplyDefinition;