import traverse from "../../core/utils/traverse"
import {Class} from "meteor/jagi:astronomy"

function getStaticDefinition(field,attribute) {
  let Klass = this
  if (this instanceof Class)
    Klass = this.constructor
  return traverse(new Klass(),field,function(nestedDoc, nestedName, fieldDefinition) {
    if (typeof(attribute) === "string" && attribute) {
      return fieldDefinition && fieldDefinition[attribute];
    }
    return fieldDefinition;
  })
}

export default getStaticDefinition;