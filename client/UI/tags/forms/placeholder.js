Template.registerHelper('placeholder', function() {
  const key = this.model._type + "." + this.field + ".placeholder";
  const translation = I18n.t(key);
  let placeholder = translation;
  if (this.noPlaceholder) { placeholder = ""; }
  return placeholder;
});