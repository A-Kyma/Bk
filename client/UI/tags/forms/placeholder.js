import I18n from "../../../../lib/classes/i18n";

Template.registerHelper('placeholder', function() {
  const key = this.model.constructor.getName() + "." + this.field + ".placeholder";
  const translation = I18n.t(key);
  let placeholder = translation;
  if (this.noPlaceholder) { placeholder = ""; }
  return placeholder;
});