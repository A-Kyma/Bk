import './labels.html';
import { Class } from 'meteor/jagi:astronomy';

/*
Label tag: give the label of the specified field of the specified model
Arguments:
- model is the model on wich label is called
- field is the field we want the translation
TODO => should work for "tree" fields also
Optional arguments
- label is the I18n key we want to translate (if not given, return <model._type>.<field>.label)
- noHtml implies it gives only the translated label
- noLabel implies nothing is shown
- labelClass force a certain class for tag label
*/
Template.registerHelper('label', function() {

  // Get model if this.model is a String. Return undefined if model not known
  this.model = Class.getModel(this.model);

  if (this.model && this.field) {
    //if (!this.model.canView(this.field)) { return null; }
    return Template["_label"];
  } else {
    this.tag = "label";
    return Template["_tagMissing"];
  }
});

Template._label.helpers({
  key() {
    return this.label || this.model.constructor.getLabelKey(this.field);
  }
});

Template._inlineLabel.helpers({
  key() {
    return this.label || this.model.constructor.getLabelKey(this.field);
  }
});
Template._labelClean.helpers({
  key() {
    return this.label || this.model.constructor.getLabelKey(this.field);
  }
});