import {Class} from "meteor/jagi:astronomy"
import DateTime from "../classes/DateTime"

// Only for I18n functions

DateTime.relative = function(value) {
  const I18n = Class.get("I18n")
  let now = new Date()
  let diffTime = Math.abs(now - value);
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return I18n.get('Date.format.relative.days',{count: diffDays})
}

DateTime.getValue = function(value,extFormat,locale) {
  const I18n = Class.get("I18n")
  //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  if (!value) return undefined
  const language = I18n.getLanguage(locale)
  let extDate
  if (typeof extFormat === "object"){
    extFormat.timeZone = "Europe/Brussels" // Bad timezone for emails sent.
    extDate = new Intl.DateTimeFormat(
      language, extFormat).format(value);
    return extDate
  } else {
    extDate = new Intl.DateTimeFormat(
      language).format(value);
    return extDate
  }
}

