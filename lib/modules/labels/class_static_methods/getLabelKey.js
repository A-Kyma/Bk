// TODO: change it when getPreferenceField/getDottedField done

function getLabelKey(fieldName) {
  return this.schema.fields[fieldName].label;
}

export default getLabelKey;