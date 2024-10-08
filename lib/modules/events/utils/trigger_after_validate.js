import { Event } from 'meteor/jagi:astronomy';

function triggerAfterValidate(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc,
    formModel
  } = args;
  // Trigger the "afterValidate" event handlers.
  doc.dispatchEvent(
    new Event("afterValidate", {
      propagates: false,
      doc,
      stopOnFirstError,
      fields,
      simulation,
      forceUpdate,
      trusted,
      oldDoc,
      formModel
    })
  );
}

export default triggerAfterValidate;
