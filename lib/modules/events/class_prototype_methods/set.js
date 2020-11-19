import triggerBeforeSet from "../utils/trigger_before_set";
import triggerAfterSet from "../utils/trigger_after_set";
import _isPlainObject from 'lodash/isPlainObject';

function set(...args) {
  let doc = this;
  let fields;
  let fieldArguments = {};
  let options = {};
  if (typeof args[0] === 'string' && args.length >= 1) {
    fields = [args[0]];
    fieldArguments[args[0]] = args[1];
    options = args[2];
  } else if (_isPlainObject(args[0]) && args.length >= 1) {
    fields = Object.keys(args[0]);
    fieldArguments = args[0];
    options = args[1];
  }

  let methodArgs = {
    doc,
    stopOnFirstError: true,
    fields,
    simulation: false,
    forceUpdate: false,
    trusted: true,
    changes: fieldArguments,
    options
  };

  triggerBeforeSet(methodArgs);
  this.astroSet(fieldArguments,options);
  triggerAfterSet(methodArgs);
}

export default set;