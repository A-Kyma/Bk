import getDefinition from "./getDefinition";

function getClass(field) {
  let definition = this.getDefinition(field);
  if (!definition) return;
  return definition.type.class;
}

export default getClass;