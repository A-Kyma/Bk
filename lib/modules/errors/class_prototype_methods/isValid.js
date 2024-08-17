//see https://github.com/lukejagodzinski/meteor-reactive-map
import { ValidationError } from 'meteor/akyma:astronomy';
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

  if (options.simulationOnly)
    try {
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
  else {
   this.validate(options,(err) => {
     this.clearError(field)
     if (err) {
       if (ValidationError.is(err)) {
         this.setError(err)
       } else {
         throw err
       }
     }
   })
  }
}

export default isValid;