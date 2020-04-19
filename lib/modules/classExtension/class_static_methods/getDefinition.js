import traverse from "../../core/utils/traverse";

function getStaticDefinition(field) {
  return traverse(new this(),field,function(nestedDoc, nestedName, fieldDefinition) {
    return fieldDefinition;
  })
}

export default getStaticDefinition;