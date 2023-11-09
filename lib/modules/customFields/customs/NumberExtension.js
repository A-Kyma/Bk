import I18n from "../../../classes/i18n";
import intlUnit from "../utils/intlUnit";

Number.prototype.pad = function (size) {
  return this.toString().pad(size)
};

// see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
/***
 * @param {Number} value Number to format
 * @param {Number} decimal Number of  maximum fraction digits allowed
 * @param {String} unit of the number (g,kg,l)
 */
Number.getValue = function(value,decimal=3,unit) {
  let displayUnit

  if (typeof unit !== undefined) {
    displayUnit = intlUnit[unit]
  }
  return new Intl.NumberFormat(
    I18n.getLanguage(), {
      style: !!unit ? "unit" : "decimal",
      maximumFractionDigits: decimal,
      unit: displayUnit
    }).format(value);
}