import traverse from "../../core/utils/traverse";

function getDefinition(field) {
  return traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
    return fieldDefinition;
  })
}

export default getDefinition;