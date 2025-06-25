import {Class} from "meteor/jagi:astronomy"
import Amount from "../classes/Amount"

// Only for I18n functions

Amount.getValue = function(value,decimal=2,unit,currency="EUR") {
  const I18n = Class.get("I18n")
  let result = new Intl.NumberFormat(
    I18n.getLanguage(),
    {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: decimal
    }).format(value);

  if (typeof unit == "string") {
    return result + unit
  }
  return result
}