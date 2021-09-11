function getPlaceHolderKey(fieldName) {
  let definition = this.getDefinition(fieldName);
  if (!definition) { return ""; }

  if (definition.placeholder) {
    return definition.placeholder;
  } else {
    return this.getName() + "." + fieldName + ".placeholder";
  }
}

export default getPlaceHolderKey;