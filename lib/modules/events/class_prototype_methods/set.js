import triggerBeforeSet from "../utils/trigger_before_set";
import triggerAfterSet from "../utils/trigger_after_set";
import _isPlainObject from 'lodash/isPlainObject';

function set(...args) {
  let doc = this;
  let fields;
  let fieldArguments = {};
  if (typeof args[0] === 'string' && args.length >= 2) {
    fields = [args[0]];
    fieldArguments[args[0]] = args[1];
  } else if (_isPlainObject(args[0]) && args.length >= 1) {
    fields = Object.keys(args[0]);
    fieldArguments = args[0];
  }
  let methodArgs = {
    doc,
    stopOnFirstError: true,
    fields,
    simulation: false,
    forceUpdate: false,
    trusted: true,
    changes: fieldArguments
  };

  triggerBeforeSet(methodArgs);
  this.astroSet(...args);
  triggerAfterSet(methodArgs);
}

export default set;