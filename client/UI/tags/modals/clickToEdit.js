import './clickToEdit.html';
import { ReactiveVar } from 'meteor/reactive-var';

/*
Click to edit helper will give you the opportunity to create
an inline edit element in the dom

Usage:
{{#clickToEdit model=user checkEmpty=1 field="description"}}
{{> viewtag}} or text    // This will be clickable to show the input
{{else}}
{{> input tag(s)}}       // This will be submitable
{{/clickToEdit}}

model and field arguments are mandatory if checkEmpty is true
checkEmpty will show value I18n.t("app.undefined") if model.attributes[field] is empty.
*/
// When initializing clickToEdit template, add new inner field which will be reactive

// This is equivalent to declaration Template.clickToEdit.clickToEdit
// but since we want to add reactivity on the field, this is the trick :)
Template.clickToEdit.onCreated(() => Template.instance().clickToEdit = new ReactiveVar(true));


// In order to focus on the first input element after click to have input part
Template._innerInputInlineEditSubmit.onRendered(function() {
  const parentDom = $(this.find(".editable-buttons")).closest(".input-inline-editable");
  if (parentDom.length === 0) { return; }
  const elem = parentDom.find("input,select,textarea");
  if (elem.length === 0) { return; }
  elem[0].focus();
});

Template._afterInput.events({
  "click .editable-clear-x"(event) {
    const parentDom = $(event.target).closest(".input-group");
    const elements = parentDom.find("input,textarea,select").val("");
    elements[0].focus();
  }
});

Template.clickToEdit.helpers({
  clickToEdit() { return Template.instance().clickToEdit; },
  isEmpty(field) { return _.isEmpty(this.model) || _.isEmpty(this.model.attributes) || (!_.isNumber(this.model.get(field)) && !_.isDate(this.model.get(field)) && _.isEmpty(this.model.get(field))); }
});


Template.clickToEdit.events({
  //Toggle between view (then) and inputs (else) parts
  "click .toggleLinkToEdit"(e, tmpl) {
    const c2e = tmpl.clickToEdit;
    c2e.set((c2e.get() ? false : true));
    this.model = this.model.constructor.findInstance(this.model.id);
  },

  //Closes input part on blur
//  "blur input,select,textarea": (e, tmpl) ->
//    c2e = tmpl.clickToEdit
//    c2e.set true
//    clearErrors()
//    return

  //To prevent to early close while clicking on a button or another field of the clickToEdit tag
//  "focus input,select,textarea,button": (e, tmpl) ->
//    c2e = tmpl.clickToEdit
//    c2e.set false
//    return

  //Catch enter and escape in any input of click2Edit and submit it
  "keypress input,select"(event, tmpl) { if (event.which === 13) { return BkClientCore.callFormInline(event, this); } },

  "keyup input,select,textarea"(event, tmpl) {
    if (event.which === 27) {
      const c2e = tmpl.clickToEdit;
      c2e.set(true);
    }
  }
});

// Call form inline to submit the inline edit
Template._innerInputInlineEditSubmit.events({
  "click .editable-submit"(event, template) { return BkClientCore.callFormInline(event, this); }});
