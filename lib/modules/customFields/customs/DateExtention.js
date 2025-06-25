import {Class} from "meteor/jagi:astronomy"

Date.getValue = function(value,extFormat,locale) {
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
    extDate = new Intl.DateTimeFormat(language).format(value);
    return extDate
  }
}