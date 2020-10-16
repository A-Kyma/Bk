import triggerBeforeValidate from "../utils/trigger_before_validate";
import triggerAfterValidate from "../utils/trigger_after_validate";

function validate(...args) {
  let doc = this;
  let methodArgs = {
    doc,
    stopOnFirstError: args.stopOnFirstError,
    fields: args.fields,
    simulation: false,
    forceUpdate: false,
    trusted: true
  };

  triggerBeforeValidate(methodArgs);
  this.astroValidate(...args);
  triggerAfterValidate(methodArgs);
}

export default validate;