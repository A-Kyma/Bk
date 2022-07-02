import Enum from "../customs/Enum"
import {Class} from "meteor/jagi:astronomy"
import { ReactiveVar } from 'meteor/reactive-var'

let astronomyClass = new ReactiveVar(undefined,(a,b) => {
  if (!a && !b) return true
  return a?.getName && a.getName() === b?.getName && b.getName()
})

const AstronomyFields = Enum.create({
  name: "AstronomyFields",
  identifiers: () => {
    let ac = astronomyClass.get()
    if (!ac) return []
    return ac.getScalarFields().map(field=>field.name)
  }
})

AstronomyFields.setClass = function(c) {
  let ac = Class.getClass(c)
  if (ac)
    astronomyClass.set(ac)
}

AstronomyFields.getLabelKey = function(field) {
  return field;
}

export default AstronomyFields