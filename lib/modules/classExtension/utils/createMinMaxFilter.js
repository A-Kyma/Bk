import { Class as AstroClass} from "meteor/jagi:astronomy"
import { Type } from "meteor/jagi:astronomy"

function createMinMaxFilter(type, definition={}) {
  const typeClass = Type.types[type].class

  let Class = AstroClass.get("BkMinMaxFilter" + type)
  if (Class) return Class

  let fieldDefinition = { type: typeClass, optional: true }

  Class = AstroClass.create({
    name: 'BkMinMaxFilter' + type,
    fields: {
      min: fieldDefinition,
      max: fieldDefinition,
    }
  })

  return Class
}

export default createMinMaxFilter