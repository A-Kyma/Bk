import Amount from "../classes/Amount";
import I18n from "../../../classes/i18n";

// Only for I18n functions

Amount.getValue = function(value,decimal=2,unit,currency="EUR") {
  let result = new Intl.NumberFormat(
    I18n.getLanguage(), {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: decimal
    }).format(value);

  if (typeof unit == "string") {
    return result + unit
  }
  return result
}