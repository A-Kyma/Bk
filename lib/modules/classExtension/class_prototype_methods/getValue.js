import Enum from "../../customFields/customs/Enum";
import I18n from "../../../classes/i18n";

function getValue(field) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldClass = definition.type.class
  if (definition?.type?.name === "Amount"){
    return new Intl.NumberFormat(
        I18n.getLanguage(), {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0
        }).format(value);
  }
  if (["Number","Integer","String"].includes(definition?.type?.name)){
      return (definition.ui?.append)? value + definition.ui.append : value
  }
  if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  return fieldClass.getLabelKey(value);
}

export default getValue;