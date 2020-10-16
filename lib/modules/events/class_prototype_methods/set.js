import triggerBeforeSet from "../utils/trigger_before_set";
import triggerAfterSet from "../utils/trigger_after_set";
import _isPlainObject from 'lodash/isPlainObject';

function set(...args) {
  let doc = this;
  let fields;
  if (typeof args[0] === 'string' && args.length >= 2) {
    fields = [args[0]];
  } else if (_isPlainObject(args[0]) && args.length >= 1) {
    fields = args[0];
  }
  let methodArgs = {
    doc,
    stopOnFirstError: true,
    fields,
    simulation: false,
    forceUpdate: false,
    trusted: true
  };

  triggerBeforeSet(methodArgs);
  this.astroSet(...args);
  triggerAfterSet(methodArgs);
}

export default set;