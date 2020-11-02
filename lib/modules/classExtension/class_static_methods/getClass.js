import getStaticDefinition from "./getDefinition";

function getStaticClass(field) {
  let definition = this.getStaticDefinition(field);
  if (!definition) return;
  return definition.type.class;
}

export default getStaticClass;