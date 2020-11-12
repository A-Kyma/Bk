import getStaticDefinition from "./getDefinition";

function getStaticFieldClass(field) {
  let definition = this.getStaticDefinition(field);
  if (!definition) return;
  return definition.type.class;
}

export default getStaticFieldClass;