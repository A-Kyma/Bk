import { Event } from 'meteor/akyma:astronomy';

function triggerAfterValidate(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
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
      oldDoc
    })
  );
}

export default triggerAfterValidate;
