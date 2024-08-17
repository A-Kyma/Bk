import { ListField, ObjectField, ScalarField } from "meteor/akyma:astronomy"
import { Class as AstroClass} from "meteor/akyma:astronomy"

function getFilterQuery(options={}) {
  let {
    fields,
    parentField,
  } = options;

  let raw = this.raw()
  const Class = this.constructor
  let filter = {}

  // If there are not fields specified, then get all of them.
  if (!fields) {
    fields = Class.getFieldsNames();
  }
  fields.forEach(field => {
    let filterField = (parentField) ? parentField + "." + field : field

    let value = this.get(field)
    if (value === undefined || value === null
      || (Array.isArray(value) && value.length === 0)) {
      return
    }
    let definition = this.getDefinition(field)
    if (definition.notQueryFilter) return
    if (!!definition.filterFunction && typeof definition.filterFunction === "function") {
      filter = {...filter,...definition.filterFunction(value)}
      return
    }
    if (!!definition.filterOperator) {
      if (definition.filterOperator === "$gte$lte" && typeof value === "object") {
        filter[filterField] = { }
        if (value.min !== null && !isNaN(value.min)) filter[filterField].$gte = value.min
        if (value.max !== null && !isNaN(value.max)) filter[filterField].$lte = value.max
        if (Object.keys(filter[filterField]).length === 0) delete filter[filterField]
        return
      }
      if (Array.isArray(value) && ["$or","$and","$in","$all"].includes(definition.filterOperator)) {
        if (definition.filterOperator === "$or") filter[filterField] = { $elemMatch: {$in: value} }
        if (definition.filterOperator === "$and") filter[filterField] = { $all: value }
        if (definition.filterOperator === "$in") filter[filterField] = { $in: value }
        if (definition.filterOperator === "$all") filter[filterField] = { $all: value }
        return
      }
      if (typeof value === "string" && definition.filterOperator === "$regex") {
        filter[filterField] = {$regex: "^" + value, $options: "i"}
        return
      }

      if (definition.filterOperator === "$eq" && definition.type.name.startsWith("Boolean")) {
        if (value !== true)
          filter[filterField] = {$ne: true}
        else
          filter[filterField] = true
        return
      }

      if (definition.filterOperator === "$eq") {
        filter[filterField] = value
        return
      }
    }

    // In case embedded class
    if (definition instanceof ObjectField) {
      filter = {...filter,...value.getFilterQuery({
                  parentField: filterField
               })}
    }
  })

  //console.log("Filter: ",JSON.stringify(filter))
  return filter
}

export default getFilterQuery