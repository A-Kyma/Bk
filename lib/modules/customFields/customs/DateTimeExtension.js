import DateTime from "../classes/DateTime";
import I18n from "../../../classes/i18n";

DateTime.relative = function(value) {
  let now = new Date()
  let diffTime = Math.abs(now - value);
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return I18n.get('Date.format.relative.days',{count: diffDays})
}

DateTime.getValue = function(value,extFormat) {
  //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  if (!value) return undefined
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

DateTime.getDate = function(value) {
  return DateTime.getValue(value)
}

DateTime.getISODate = function(value) {
  if (! value instanceof Date) return undefined
  return value.toISOString().split("T").shift()
}

DateTime.getLongDate = function(value) {
  return DateTime.getValue(value,{weekday: "long", day: "numeric", month: "long", year: "numeric"})
}

DateTime.getTime = function(value) {
  return DateTime.getValue(value,{hour: "numeric", minute: "numeric"})
}