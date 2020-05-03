import traverse from "../../core/utils/traverse";

function getDefinition(field,attribute) {
  return traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
    if (typeof(attribute) === "string" && attribute) {
      return fieldDefinition && fieldDefinition[attribute];
    }
    return fieldDefinition;
  })
}

export default getDefinition;