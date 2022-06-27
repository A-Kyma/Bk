import Enum from "../customs/Enum"
import {Class} from "meteor/jagi:astronomy"

const AstronomyClasses = Enum.create({
  name: "AstronomyClasses",
  identifiers: () => Object.keys(Class.classes).sort()
})

AstronomyClasses.getLabelKey = function(field) {
  return field;
};

export default AstronomyClasses