import { ValidationError } from 'meteor/jagi:astronomy';

function isValid(field) {
  let options = {
    cast: true,
    stopOnFirstError: false
  }

  if (field) {
    options.fields = field;
  }

  try {
    this.validate(options);
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