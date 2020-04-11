/*****************************************************
 ******************** ERRORS **************************
 *****************************************************/
const Errors = new Mongo.Collection(null);

const insertError = function(err,modal) {
  var modalDom = $("#clickToModal")
  modalDom = modalDom && modalDom[0]
  if (modal || !_.isEmpty(modalDom))
    modal = true
  else
    modal = false

  var message
  var details = err.details
  if (details)
    message = I18n.t(details.message.key,details.message.options)
  else if (err.message)
    message = err.message
  else
    message = err

  Errors.insert({message: message, modal: modal})
}

const clearErrors = function() {
  Errors.remove({});
}

export default {
  Errors,
  insertError,
  clearErrors
}