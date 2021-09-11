import traverse from "../../core/utils/traverse";

function getStaticDefinition(field,attribute) {
  return traverse(new this(),field,function(nestedDoc, nestedName, fieldDefinition) {
    if (typeof(attribute) === "string" && attribute) {
      return fieldDefinition && fieldDefinition[attribute];
    }
    return fieldDefinition;
  })
}

export default getStaticDefinition;