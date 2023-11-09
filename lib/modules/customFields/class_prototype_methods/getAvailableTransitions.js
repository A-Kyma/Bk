import Lifecycle from "../customs/Lifecycle";

export default function(field) {
  const fieldClass = this.getFieldClass(field)

  if (!fieldClass instanceof Lifecycle)
    return []

  return fieldClass.getTransitionsForModel(this,field)
}