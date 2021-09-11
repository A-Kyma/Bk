function getLabelKey(fieldName) {
  let definition = this.getDefinition(fieldName);
  if (!definition) { return ""; }

  if (definition.label) {
    return definition.label;
  } else {
    return this.getName() + "." + fieldName + ".label";
  }
}

export default getLabelKey;