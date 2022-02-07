import { Class as AstroClass} from "meteor/jagi:astronomy"
import { Type } from "meteor/jagi:astronomy"

function createMinMaxFilter(type, definition={}) {
  const typeClass = Type.types[type].class

  let Class = AstroClass.get("BkMinMaxFilter" + type)
  if (Class) return Class

  Class = AstroClass.create({
    name: 'BkMinMaxFilter' + type,
    fields: {
      min: { type: typeClass, optional: true, label: "app.min", placeholder: " ", filterOperator: "$gte" },
      max: { type: typeClass, optional: true, label: "app.max", placeholder: " ", filterOperator: "$lte" },
    }
  })

  return Class
}

export default createMinMaxFilter