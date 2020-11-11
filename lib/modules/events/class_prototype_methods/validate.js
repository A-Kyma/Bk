import triggerBeforeValidate from "../utils/trigger_before_validate";
import triggerAfterValidate from "../utils/trigger_after_validate";

function validate(...args) {
  let doc = this;
  let fields = args[0] && args[0].fields || [];
  if (typeof fields === "string") {
    fields = [fields];
  }

  let methodArgs = {
    doc,
    stopOnFirstError: args[0] && args[0].stopOnFirstError,
    fields,
    simulation: false,
    forceUpdate: false,
    trusted: true
  };

  triggerBeforeValidate(methodArgs);
  this.astroValidate(...args);
  triggerAfterValidate(methodArgs);
}

export default validate;