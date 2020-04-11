import I18n from "../../../../lib/modules/i18n/module.js";

Template.registerHelper("t", function(key, options) {
  options = options || {};
  if (options.hash && options.hash.type) {
    if (options.hash.type === "date") { return I18n.getDate(key); }
    if (options.hash.type === "time") { return I18n.getTime(key); }
  } else {
    return I18n.t(key, options.hash);
  }
});