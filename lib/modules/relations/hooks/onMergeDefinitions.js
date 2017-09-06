import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.relations, function(relationDefinition, relationName) {
    targetDefinition.relations[relationName] = relationDefinition;
  });
};

export default onMergeDefinitions;