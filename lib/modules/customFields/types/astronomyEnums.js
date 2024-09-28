import Enum from "../customs/Enum"
import {Class} from "meteor/jagi:astronomy"

const AstronomyEnums = Enum.create({
  name: "AstronomyEnums",
  identifiers: () => Object.keys(Enum.enums).sort()
})

AstronomyEnums.getLabelKey = function(field) {
  return field;
}

export default AstronomyEnums