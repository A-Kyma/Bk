import Enum from "../../customFields/customs/Enum";
// Avoid importing I18n. This implies all modules are not loaded in I18n class
// import I18n from "../../../classes/i18n";
import Amount from "../../customFields/classes/Amount";
import DateTime from "../../customFields/classes/DateTime";
import {Class,ListField,ObjectField} from "meteor/jagi:astronomy"

function getValue(field, format) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldClass = definition.type.class
  let extFormat = format || definition.format

  if (definition.relation) {
    // belongs to many relation
    if (definition instanceof ListField) {
      let relations = this[field + "Instances"]();
      // submodel has been subscribed
      if (relations) {
        let submodels = relations.map(e => e.defaultName())
        return submodels.join(", ")
      } else {
        // submodel not subscribed but cached
        if (definition.cache) {
          let submodels = this[field].map(e => new definition.relation(e).defaultName())
          return submodels.join(", ")
        } else {
          // We have only the ids
          return this[field].join(", ")
        }
      }
    } else {
      // belongs to one relation
      let relation = this[field + "Instance"]();
      // submodel has been subscribed
      if (relation) {
        return relation.defaultName()
      } else {
        // submodel not subscribed but cached
        if (definition.cache) {
          let submodel = new definition.relation(this[field])
          return submodel.defaultName()
        } else {
          // we have only the ids
          return this[field]
        }
      }
    }
  }

  if (definition.type?.name === "Amount"){
    return Amount.getValue(value)
  }
  if (["Date","DateTime"].includes(definition?.type?.name)){
        if (extFormat === "relative"){
          return DateTime.relative(value)
        }
        return DateTime.getValue(value,extFormat)
  }
  if (["Number","Integer","String"].includes(definition?.type?.name)){
      return (definition.ui?.append)? value + definition.ui.append : value
  }
  // if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  // return fieldClass.getLabelKey(value);
  //if (typeof fieldClass?.getLabelKey === "function") {
  if (["Enum","Lifecycle"].includes(fieldClass?.name)) {
    if (definition instanceof ListField) {
      return value.map(e => fieldClass.getLabelKey(e))
    } else {
      return fieldClass.getLabelKey(value)
    }
  } else {
    if (definition instanceof ObjectField) {
      return this[field].defaultName && this[field].defaultName()
    }
  }
  return value
}

export default getValue;