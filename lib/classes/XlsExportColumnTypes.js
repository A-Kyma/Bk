import Enum from "../modules/customFields/customs/Enum";

// See https://docs.sheetjs.com/docs/csf/features/nf
const identifierFormat = {
  "string": "",
  "date": "dd/mm/yyyy",
  "datetime": "dd/mm/yyyy hh:mm",
  "label": "",
  "amount": "# ##0.00_)€;[Red]-# ##0.00_)€",
  "integer": "# ##0;[Red]-# ##0",
  "decimal": "# ##0.00;[Red]-# ##0.00",
  "Enum": "I18n",
  "Lifecycle": "I18n",
  "boolean": ""
}

const XlsExportColumnTypes = Enum.create({
  name: "XlsExportColumnTypes",
  identifiers: Object.keys(identifierFormat),
})

XlsExportColumnTypes.getLabelKey = (field) => field

XlsExportColumnTypes.getFormat = function(identifier) {
  return identifierFormat[identifier];
}

export default XlsExportColumnTypes