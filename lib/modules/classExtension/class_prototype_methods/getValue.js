import Enum from "../../customFields/customs/Enum";

function getValue(field) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldClass = definition.type.class
  if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  return fieldClass.getLabelKey(value);
}

export default getValue;