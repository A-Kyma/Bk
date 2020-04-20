import './form.html';
import { Class } from "meteor/jagi:astronomy";

Template.form.onCreated(function() {
  this.data.model = Class.getModel(this.data.model);
})