//see https://github.com/lukejagodzinski/meteor-reactive-map
import { ValidationError, Module } from 'meteor/jagi:astronomy';
import _defaults from 'lodash/defaults';

function isValid(field,options={}) {
  _defaults(options,{
    cast: true, // cast all fields
    stopOnFirstError: false, // Do not stop on first error
    modified: true, // Check only modified fields
    simulationOnly: true, // Only do on client side. Exists only here for Bk
  });

  if (field) {
    if (Array.isArray(field)) options.fields = field;
    else options.fields = [field];
    //options.fields = field;
  }

  // Prepare arguments for meteor method and utility.
  let methodArgs = {
    doc: this,
    fields: options.fields,
    modified: options.modified,
    stopOnFirstError: options.stopOnFirstError,
    simulation: true,
  };

  const documentValidate = Module.modules["validators"].utils.documentValidate

  try {
    if (options.simulationOnly)
      documentValidate(methodArgs);
    else
      this.validate(options);

    this.clearError(field);
    return true;
  } catch (err) {
    if (ValidationError.is(err)) {
      this.setError(err);
    } else {
      throw err;
    }
    return false;
  }
}

export default isValid;