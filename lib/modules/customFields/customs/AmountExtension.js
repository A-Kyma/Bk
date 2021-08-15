import Amount from "../classes/Amount";
import I18n from "../../../classes/i18n";

// Only for I18n functions

Amount.getValue = function(value) {
  return new Intl.NumberFormat(
    I18n.getLanguage(), {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
}