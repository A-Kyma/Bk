import './errors.html';
import './../inputs/inputs.html';

//Helper for global errors
Template.errors.helpers({
  errors() { return Errors.find({modal:false}); }
});

Template.modalErrors.helpers({
  errors() { return Errors.find({modal:true}); }
});

//Remove all pending popover errors
Template._input.helpers({
  errorClass() {
    if (!_.isEmpty(this.model.getError(this.field))) {
      return "has-error";
    } else {
      return "";
    }
  }
});

Template._inputError.helpers({
  hasError() { return !_.isEmpty(this.model.getError(this.field)); }});

Template._inputErrorInner.helpers({
  msgs() { return this.model.getError(this.field); }});