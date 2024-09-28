import Enum from "../customs/Enum"
import Lifecycle from "../customs/Lifecycle";

const AstronomyLifecycles = Enum.create({
  name: "AstronomyLifecycles",
  identifiers: () => Object.keys(Lifecycle.lifecycles).sort()
})

AstronomyLifecycles.getLabelKey = function(field) {
  return field;
}

export default AstronomyLifecycles