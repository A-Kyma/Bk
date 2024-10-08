import { Class } from 'meteor/jagi:astronomy'
import AstronomyScalarType from "../modules/customFields/types/astronomyScalarType";
import Enum from "../modules/customFields/customs/Enum";

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