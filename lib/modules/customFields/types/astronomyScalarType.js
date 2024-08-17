import Enum from "../customs/Enum"
import {Class} from "meteor/akyma:astronomy"

const AstronomyScalarType = Enum.create({
  name: "AstronomyScalarType",
  identifiers: () => ["Boolean","Date","String","Amount"].concat(Object.keys(Enum.enums).sort())
})

AstronomyScalarType.getLabelKey = function(field) {
  return field;
}

export default AstronomyScalarType