import Enum from "../modules/customFields/customs/Enum";
import Lifecycle from "../modules/customFields/customs/Lifecycle"
import {Class, ObjectField} from "meteor/jagi:astronomy"

// See https://docs.sheetjs.com/docs/csf/features/nf
const identifierFormat = {
  "string": "",
  "date": "dd/mm/yyyy",
  "datetime": "dd/mm/yyyy hh:mm",
  "label": "",
  "amount": "# ##0.00_)€;[Red]-# ##0.00_)€",
  "integer": "# ##0;[Red]-# ##0",
  "decimal": "# ##0.00;[Red]-# ##0.00",
  "Enum": "",
  "Lifecycle": "",
  "boolean": "",
  "Class": "",
}

const XlsExportColumnTypes = Enum.create({
  name: "XlsExportColumnTypes",
  identifiers: Object.keys(identifierFormat),
})

XlsExportColumnTypes.getLabelKey = (field) => field

XlsExportColumnTypes.getFormat = function(identifier) {
  return identifierFormat[identifier];
}

XlsExportColumnTypes.getFromDefinition = function(definition) {
  if (!!definition.relation)
    return "Class"

  if (typeof definition.type.class.getClassName === "function")
    return definition.type.class.getClassName()

  // if (["title","name"].includes(definition.name))
  //   return "label"

  let columnType = definition.type.name.toLowerCase()

  if (Object.keys(identifierFormat).includes(columnType))
    return columnType

  // Not found
  return
}

export default XlsExportColumnTypes