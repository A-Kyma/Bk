function getDescriptionKey(fieldName) {
  let definition = this.getDefinition(fieldName);
  if (!definition) { return ""; }

  if (definition.description) {
    return definition.description;
  } else {
    return this.getName() + "." + fieldName + ".description";
  }
}

export default getDescriptionKey;