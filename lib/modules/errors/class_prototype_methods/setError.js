import traverse from "../../core/utils/traverse";
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import isNestedFieldName from "../../core/utils/isNestedFieldName";

import { ValidationError } from 'meteor/jagi:astronomy';

function setError(errors) {
  let doc = this;

  if (!ValidationError.is(errors)) {
    return;
  }

  let array = errors.details;
  if (_isEmpty(array)) {
    return;
  }

  let fieldErrors = {};

  // Construct array of errors for each fields
  array.forEach(element => {
    let fieldName = element.name;
    if (fieldErrors[fieldName] === undefined) { fieldErrors[fieldName] = [] };
    fieldErrors[fieldName].push(element);
  })
  // then, set the array (only once) in the _errors ReactiveMap
  _forEach(fieldErrors,(fieldErrorsArray,fieldName) => {
    traverse(doc,fieldName,function(nestedDoc, nestedName, fieldDefinition) {
      nestedDoc._errors.set(nestedName,fieldErrorsArray);
    })
  })
}


export default setError;