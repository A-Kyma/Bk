import Enum from "../../customFields/customs/Enum";
import I18n from "../../../classes/i18n";

function getValue(field, format) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldClass = definition.type.class
  let extFormat = format || definition.format

  if (definition.type?.name === "Amount"){
    return new Intl.NumberFormat(
        I18n.getLanguage(), {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0
        }).format(value);
  }
  if (["Date","DateTime"].includes(definition?.type?.name)){
        if (extFormat === "relative"){
            let now = new Date()
            let diffTime = Math.abs(now - value);
            let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            let relativeDate = I18n.get('Date.format.relative.days',{count: diffDays})

            return relativeDate
        }
        //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
        let extDate
        if (typeof extFormat === "object"){
            extDate = new Intl.DateTimeFormat(
                I18n.getLanguage(), extFormat).format(value);
            return extDate
        } else {
            extDate = new Intl.DateTimeFormat(
                I18n.getLanguage()).format(value);
            return extDate
        }
  }
  if (["Number","Integer","String"].includes(definition?.type?.name)){
      return (definition.ui?.append)? value + definition.ui.append : value
  }
  if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  return fieldClass.getLabelKey(value);
}

export default getValue;