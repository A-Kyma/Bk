import { Class } from 'meteor/akyma:astronomy'
import { AstronomyScalarType, Enum } from "../modules/customFields/module.js";

const ParameterTableOption = Class.create({
  name: "ParameterTableOption",
  fields: {
    name: {type: String},
    inputType: {
      type: AstronomyScalarType,
      ui: {
        template: "BkBelongsToMany"
      },
      sort: false
    },
    multipleChoice: {
      type: Boolean,
      canView({doc}) {
        return Object.keys(Enum.enums).includes(doc.inputType)
          || ["String","XlsExportColumnParam"].includes(doc.inputType)
      },
      default: false,
    },
    description: { type: String, optional: true}
  },
  permissions: {
    canDelete() { return true }
  }
})

export default ParameterTableOption