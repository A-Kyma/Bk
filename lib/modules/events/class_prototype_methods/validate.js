import triggerBeforeValidate from "../utils/trigger_before_validate";
import triggerAfterValidate from "../utils/trigger_after_validate";
import { Module } from "meteor/jagi:astronomy"


function validate(...args) {
  let doc = this;
  let simulationOnly = args[0] && args[0].simulationOnly
  let fields = args[0] && args[0].fields;
  if (typeof fields === "string") {
    fields = [fields];
  }

  const documentValidate = Module.modules["validators"].utils.documentValidate

  let methodArgs = {
    doc,
    stopOnFirstError: args[0] && args[0].stopOnFirstError || false,
    modified: args[0] && args[0].modified || !doc.constructor.isNew(doc),
    fields,
    simulation: true,
    forceUpdate: false,
    trusted: true,
    formModel: args[0] && args[0].formModel
  };

  // New event before validation
  triggerBeforeValidate(methodArgs);
  /***
   * simulationOnly added in errors module : isValid.
   * it avoid to check the value server side while it's not needed
   */
  let options=args[0]
  let callback=args[1]
  if (simulationOnly || Meteor.isServer) {
    documentValidate(methodArgs);
    // New event after validation
    triggerAfterValidate(methodArgs)
  } else {
    this.astroValidate(options,(err) => {
      callback(err)
      if (!err)
        triggerAfterValidate(methodArgs)
    });
  }



}

export default validate;