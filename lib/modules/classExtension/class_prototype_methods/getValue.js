import Enum from "../../customFields/customs/Enum";
// Avoid importing I18n. This implies all modules are not loaded in I18n class
// import I18n from "../../../classes/i18n";
import Amount from "../../customFields/classes/Amount";
import DateTime from "../../customFields/classes/DateTime";

function getValue(field, format) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldClass = definition.type.class
  let extFormat = format || definition.format

  if (definition.relation) {
    let relation = this[field + "Instance"]();
    return (relation) ? relation.defaultName() :  this._id;
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
  if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  return fieldClass.getLabelKey(value);
}

export default getValue;