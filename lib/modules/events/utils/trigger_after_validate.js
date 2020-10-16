import { Event } from 'meteor/jagi:astronomy';

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
      propagates: true,
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
