import {ValidationError,Class} from "meteor/jagi:astronomy"

/***
 * @description throw an error for the model instance.
 * If fieldName unknown, error will be a Meteor.Error, else, a ValidationError
 * @param {String} fieldName - Name of the field in the class (can be dotted field)
 * @param {String} errorType - Type of error
 * @param {String} labelKey - key label for I18n translation
 * @param {Integer|String|Object} param - param used for I18n. So {{param}} can be used in the key
 */
function throwError(fieldName,errorType,labelKey,param) {
  let error
  let params = param
  if (["integer","string"].includes(typeof param))
    params={param: param}

  const I18n = Class.get("I18n")
  if (this.getDefinition(fieldName)) {
    error = new ValidationError([{
      name: fieldName,
      type: errorType,
      message: I18n.get(labelKey, param)
    }])
  } else {
    error = new Meteor.Error(
      errorType,
      I18n.get(labelKey, param),
    )
  }
  this.setError(error)
  throw error
}

export default throwError;

