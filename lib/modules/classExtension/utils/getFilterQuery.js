import { ListField, ObjectField, ScalarField } from "meteor/jagi:astronomy"
import { Class as AstroClass} from "meteor/jagi:astronomy"

function getFilterQuery(options={}) {
  let {
    fields,
  } = options;

  let raw = this.raw()
  const Class = this.constructor
  let filter = {}

  // If there are not fields specified, then get all of them.
  if (!fields) {
    fields = Class.getFieldsNames();
  }

  fields.forEach(field => {
    let value = this.get(field)
    if (value === undefined || value === null
      || (Array.isArray(value) && value.length === 0)) {
      return
    }
    let definition = this.getDefinition(field)
    if (!!definition.filterFunction && typeof definition.filterFunction === "function") {
      filter = {...filter,...definition.filterFunction(value)}
      return
    }
    if (!!definition.filterOperator) {
      if (definition.filterOperator === "$gte$lte" && typeof value === "object") {
        filter[field] = { }
        if (value.min !== null && !isNaN(value.min)) filter[field].$gte = value.min
        if (value.max !== null && !isNaN(value.max)) filter[field].$lte = value.max
        if (Object.keys(filter[field]).length === 0) delete filter[field]
        return
      }
      if (Array.isArray(value) && ["$or","$and","$in","$all"].includes(definition.filterOperator)) {
        if (definition.filterOperator === "$or") filter[field] = { $elemMatch: {$in: value} }
        if (definition.filterOperator === "$and") filter[field] = value
        if (definition.filterOperator === "$in") filter[field] = { $in: value }
        if (definition.filterOperator === "$all") filter[field] = { $all: value }
        return
      }
      if (typeof value === "string" && definition.filterOperator === "$regex") {
        filter[field] = {$regex: "^" + value, $options: "i"}
      }
    }

  })

  return filter
}

export default getFilterQuery