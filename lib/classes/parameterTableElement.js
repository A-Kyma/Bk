import { Class } from 'meteor/jagi:astronomy'
import Role from "./role";
import AstronomyClasses from "../modules/customFields/types/astronomyClasses"
import Enum from "../modules/customFields/customs/Enum";

const parameterTableElement = new Mongo.Collection("parameters")
const ParameterTableElement = Class.create({
  name: "ParameterTableElement",
  collection: parameterTableElement,
  secure: false,
  typeField: 'type',
  fields: {
    type: {
      type: String,
      canView() { return false }
    },
    classBehind: {
      type: AstronomyClasses,
      ui: {
        template: "BkBelongsToMany"
      },
      label: "ParameterTable.classBehind.label",
      optional: true,
      canCreate() { return false },
      canUpdate() { return false }
    },
    field: {
      type: String,
      label: "ParameterTable.field.label",
      optional: true,
      canView() { return false },
      canCreate() { return false },
      canUpdate() { return false }
    },
    fieldValue: {
      type: [String],
      optional: true
    },
    /*
    options: {
      type: [Object],
      canView({doc}) { return !!doc.classBehind}
    },
    */
  },
  permissions: {
    canCreate() { return Role.is("SuperAdministrator")},
    canUpdate() { return Role.is("SuperAdministrator")},
    canDelete() { return Role.is("SuperAdministrator")},
  },
})

/***
 * @description Create child class from its name
 * @param {String} name
 * @returns {Class}
 */
ParameterTableElement.createChildFromName = function(name) {
  const ParameterTable = Class.get("ParameterTable")
  if (!ParameterTable) return undefined

  const paramName = name.replace("ParameterTableElement","")
  const param = ParameterTable.findOne({name: paramName})
  return ParameterTableElement.createChild(param)
}

/***
 * @description create child class for specific parameter table element
 * @param {ParameterTable} parameterTable
 * @returns {Class}
 */
ParameterTableElement.createChild = function(parameterTable) {
  if (!parameterTable) return undefined
  const childName = "ParameterTableElement" + parameterTable.name
  if (Class.has(childName))
     return Class.get(childName)

  const child = ParameterTableElement.inherit({
    name: childName
  })

  child.parameterTableClassName = parameterTable.name
  child.getDescription = function(field) {
    let optionField = parameterTable.options.find(e=>e.name === field)
    return optionField?.description
  }

  if (!!parameterTable.classBehind) {
    const parameterClass = Class.getClass(parameterTable.classBehind)
    if (!parameterClass) return undefined
    const definition = parameterClass.getDefinition(parameterTable.field)
    const label = parameterClass.getName() + "." + parameterTable.field + ".label"


    // Create child class
    child.extend({
      fields: {
        classBehind: {
          type: AstronomyClasses,
          default: parameterTable.classBehind,
          immutable: true,
          label: "ParameterTable.classBehind.label",
        },
      }
    })

    // class field definition
    if (Object.keys(Enum.enums).includes(definition.type.name) && parameterTable.multipleChoice)
      child.extend({
        fields: {
          fieldValue: {
            type: [definition.type.class],
            optional: true,
            label,
            ui: {template: "BkBelongsToMany"}
          }
        }
      })
    else {
      child.extend({
        fields: {
          fieldValue: {
            type: definition.type.class,
            optional: true,
            label
          }
        }
      })
    }
  }

  // options
  parameterTable.options.forEach((option) => {
    let fieldType,template
    switch (option.inputType) {
      case "Boolean":
        fieldType = Boolean
        break
      case "String":
        fieldType = String
        break
      case "Date":
        fieldType = Date
        break
      default:
        if (option.multipleChoice)
          fieldType = [Enum.enums[option.inputType]]
        else
          fieldType = Enum.enums[option.inputType]
        template = "BkBelongsToMany"
    }
    child.extend({
      fields: {
        [option.name]: {
          type: fieldType,
          optional: true,
          label: option.name,
          ui: {template}
        }
      }
    })

    /***
     *
     * @param params
     * @return {ParameterTableElement} - return record (specific or global) if it has been found
     */
    child.getParameter = function(params) {
      const fieldValue = params[parameterTable.field]
      delete params[parameterTable.field]
      let selector = {
        type: childName,
        classBehind: parameterTable.classBehind,
        ...params
      }

      if (parameterTable.field) {
        selector = {
          ...selector,
          field: parameterTable.field,
          fieldValue: fieldValue,
        }
        let parameter = this.findOne(selector)
        if (parameter) return parameter
      }
      selector.fieldValue = {$exists: true, $size: 0}
      let parameter = this.findOne(selector)
      if (parameter) return parameter
      return undefined
    }
  })

  return child
}

export default ParameterTableElement