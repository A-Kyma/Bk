import { ListField, ObjectField, ScalarField } from "meteor/jagi:astronomy"
import { Class as AstroClass} from "meteor/jagi:astronomy"
import _each from 'lodash/each';
import createMinMaxFilter from "../utils/createMinMaxFilter";
import getFilterQuery from "../utils/getFilterQuery";
import BooleanEnum from "../../customFields/types/booleanEnum";

/***
 * @Description : Create a FilterClass from a specific Astronomy Class
 * @param {Object} options - some params to remove elements
 * @return {Class} FilterClass
 */
function createFilterClass(options={}) {
  const Class = this
  let ClassFilter = AstroClass.get(Class.className + "Filter")
  if (ClassFilter) return ClassFilter

  let definition = {
    name: Class.className + "Filter",
    collection: Class.getCollection(),
    fields: {}
  }

  _each(Class.schema.fields, (fieldInstance,fieldName) => {

    let type = fieldInstance.type
    let fieldClass = fieldInstance.type.class;
    let fieldType = fieldInstance.type.name;
    let fieldDefinition = Class.definition.fields[fieldName]
    let relation = fieldDefinition.relation

    if (fieldName === "_id") return  // continue next iteration
    if (fieldDefinition.noFilter) return
    if (fieldDefinition.transient) return


    // if fieldType === "Amount" || "Integer" || "Number"  => Min Max fields keeping ListField / Scalarfield
    // Kept as is : String, Boolean, Email, Phone, Date, Time, Url, Textarea, ObjectField not a relation
    // removed : files and options.type Removed and options.exclude fields
    // ScalarField => ListField : Enum, Lifecycle with $OR research
    // ListField Enum stays ListField with $AND research
    // City => We should have a place with max kilometer range or a group of cities ?
    // Image PEB ? Should be an Enum with specific view Searchable ?

    // All fields optional !

    if (fieldInstance instanceof ObjectField) {
      // Class object internal since external are changed into String or Object
      // if (relation) {
      //   let subClass = AstroClass.get(relation.className + "Filter")
      //   if (subClass) definition.fields[fieldName] = { type: subClass }
      //   else definition.fields[fieldName] = { type: [relation] }
      // } else {
        definition.fields[fieldName] = { type: fieldClass.createFilterClass(options), ui: fieldDefinition.ui }
      // }
    }
    else if (fieldInstance instanceof ScalarField) {
      if (relation) {
        let subClass = AstroClass.get(relation.className + "Filter")
        if (subClass) definition.fields[fieldName] = { type: subClass }
        else definition.fields[fieldName] = {
          type: [relation],
          where: fieldDefinition.where,
          subscription: fieldDefinition.subscription,
          minCharacters: (fieldDefinition.filterMinCharacters !== undefined) ?
            fieldDefinition.filterMinCharacters : fieldDefinition.minCharacters,
          method: fieldDefinition.method,
          searchable: fieldDefinition.searchable,
          filterOperator: "$in"
        }
      }
      else if (["Amount","Integer","Number","Date","DateTime"].includes(fieldType)) {
        definition.fields[fieldName] = {
          type: createMinMaxFilter(fieldType,fieldDefinition),
          filterOperator: "$gte$lte"
        }
      }
      else if (["String","Textarea","Wysiwyg","Markdown","Phone","Url","Email"].includes(fieldType)) {
        definition.fields[fieldName] = {
          type: fieldDefinition.type,
          filterOperator: "$regex"
        }
      }
      else if (fieldType === "Boolean") {
        definition.fields[fieldName] = {
          type: BooleanEnum,
          filterOperator: "$eq"
        }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Lifecycle") {
        definition.fields[fieldName] = {
          type: [ fieldClass.getEnum() ],
          filterOperator: "$in"
        }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Enum") {
        definition.fields[fieldName] = {
          type: [ fieldClass ],
          filterOperator: "$in"
        }
      }
    }
    else if (fieldInstance instanceof ListField) {
      if (relation) {
        let subClass = AstroClass.get(relation.className + "Filter")
        if (subClass) definition.fields[fieldName] = { type: subClass }
        else definition.fields[fieldName] = {
          type: [relation],
          where: fieldDefinition.where,
          subscription: fieldDefinition.subscription,
          minCharacters: (fieldDefinition.filterMinCharacters !== undefined) ?
            fieldDefinition.filterMinCharacters : fieldDefinition.minCharacters,
          method: fieldDefinition.method,
          filterOperator: "$and"
        }
      }
      else if (["Amount","Integer","Number","Date"].includes(fieldType)) {
        definition.fields[fieldName] = {
          type: [createMinMaxFilter(fieldType,fieldDefinition)]
        }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Enum") {
        definition.fields[fieldName] = {
          type: [ fieldClass ],
          ui: { template: "BkBelongsToMany" },
          searchable: false,
          filterOperator: "$all"
        }
      }
    }

    // We keep as is ? (for embedded objects, ...)
    if (! definition.fields[fieldName]) {
      definition.fields[fieldName] = {
        type: fieldDefinition.type,
      }
    }

    definition.fields[fieldName].optional = true
    definition.fields[fieldName].filterFunction = fieldDefinition.filterFunction
    definition.fields[fieldName].label = fieldDefinition.filterLabel || Class.className + "." + fieldName + ".label"
    definition.fields[fieldName].placeholder = fieldDefinition.filterPlaceholder || Class.className + "." + fieldName + ".placeholder"
    definition.fields[fieldName].ui ||= {}
    definition.fields[fieldName].ui.class = fieldDefinition.ui?.filterClass
    definition.fields[fieldName].ui.template = fieldDefinition.ui?.filterTemplate || fieldDefinition.ui?.template  })

  ClassFilter = AstroClass.create(definition)
  ClassFilter.originalClass = Class.className
  ClassFilter.prototype.getFilterQuery = getFilterQuery
  return ClassFilter
}

export default createFilterClass