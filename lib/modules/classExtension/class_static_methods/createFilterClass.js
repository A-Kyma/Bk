import { ListField, ObjectField, ScalarField } from "meteor/jagi:astronomy"
import { Class as AstroClass} from "meteor/jagi:astronomy"
import _each from 'lodash/each';
import createMinMaxFilter from "../utils/createMinMaxFilter";

/***
 * @Description : Create a FilterClass from a specific Astronomy Class
 * @param {Class} Class - Astronomy Class from which we want to create filters
 * @param {Object} options - some params to remove elements
 * @return {Class} FilterClass
 */
function createFilterClass(Class, options={}) {

  let ClassFilter = AstroClass.get(Class.className + "Filter")
  if (ClassFilter) return ClassFilter

  let definition = {
    name: Class.className + "Filter",
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
        definition.fields[fieldName] = { type: createFilterClass(fieldClass,options), ui: fieldDefinition.ui }
      // }
    }
    else if (fieldInstance instanceof ScalarField) {
      if (relation) {
        let subClass = AstroClass.get(relation.className + "Filter")
        if (subClass) definition.fields[fieldName] = { type: subClass }
        else definition.fields[fieldName] = { type: [relation] }
      }
      else if (["Amount","Integer","Number"].includes(fieldType)) {
        definition.fields[fieldName] = { type: createMinMaxFilter(fieldType,fieldDefinition) }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Lifecycle") {
        definition.fields[fieldName] = { type: [ fieldClass.getEnum() ], filterOperator: "$OR" }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Enum") {
        definition.fields[fieldName] = { type: [ fieldClass ], filterOperator: "$OR" }
      }
    }
    else if (fieldInstance instanceof ListField) {
      if (relation) {
        let subClass = AstroClass.get(relation.className + "Filter")
        if (subClass) definition.fields[fieldName] = { type: subClass }
        else definition.fields[fieldName] = { type: [relation] }
      }
      else if (["Amount","Integer","Number"].includes(fieldType)) {
        definition.fields[fieldName] = { type: [createMinMaxFilter(fieldType,fieldDefinition)] }
      }
      else if (fieldClass.getClassName && fieldClass.getClassName() === "Enum") {
        definition.fields[fieldName] = { type: [ fieldClass ], filterOperator: "$AND" }
      }
    }

    // We keep as is ?
    if (! definition.fields[fieldName]) {
      definition.fields[fieldName] = { type: fieldDefinition.type }
    }

    definition.fields[fieldName].optional = true
    definition.fields[fieldName].label = fieldDefinition.filterLabel || Class.className + "." + fieldName + ".label"
    definition.fields[fieldName].placeholder = fieldDefinition.filterPlaceholder || Class.className + "." + fieldName + ".placeholder"

  })

  ClassFilter = AstroClass.create(definition)
  return ClassFilter
}

export default createFilterClass