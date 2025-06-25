import {Class} from "meteor/jagi:astronomy"
import intlUnit from "../utils/intlUnit"

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
  const I18n = Class.get("I18n")
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