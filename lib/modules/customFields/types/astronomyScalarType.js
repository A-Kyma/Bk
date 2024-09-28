import Enum from "../customs/Enum"
import {Class} from "meteor/jagi:astronomy"

const AstronomyScalarType = Enum.create({
  name: "AstronomyScalarType",
  identifiers: () => ["Boolean","Date","String","Textarea","Amount","XlsExportColumnParam"].concat(Object.keys(Enum.enums).sort())
})

AstronomyScalarType.getLabelKey = function(field) {
  return field;
}

export default AstronomyScalarType