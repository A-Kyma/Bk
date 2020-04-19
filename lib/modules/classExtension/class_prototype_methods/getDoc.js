import traverse from "../../core/utils/traverse";

function getDoc(field) {
  return traverse(this,field,function(nestedDoc, nestedName, fieldDefinition) {
    return nestedDoc;
  })
}

export default getDoc;