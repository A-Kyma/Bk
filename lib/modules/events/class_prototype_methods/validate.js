import triggerBeforeValidate from "../utils/trigger_before_validate";
import triggerAfterValidate from "../utils/trigger_after_validate";
import { Module } from "meteor/jagi:astronomy"


function validate(...args) {
  let doc = this;
  let fields = args[0] && args[0].fields;
  if (typeof fields === "string") {
    fields = [fields];
  }

  const documentValidate = Module.modules["validators"].utils.documentValidate

  let methodArgs = {
    doc,
    stopOnFirstError: args[0] && args[0].stopOnFirstError || false,
    modified: args[0] && args[0].modified || true,
    fields,
    simulation: true,
    forceUpdate: false,
    trusted: true
  };

  triggerBeforeValidate(methodArgs);
  if (args[0] && args[0].simulationOnly)
    documentValidate(methodArgs);
  else
    this.astroValidate(...args);
  triggerAfterValidate(methodArgs);
}

export default validate;