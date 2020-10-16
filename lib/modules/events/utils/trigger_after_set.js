import { Event } from 'meteor/jagi:astronomy';

function triggerAfterSet(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "afterSet" event handlers.
  doc.dispatchEvent(
    new Event("afterSet", {
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

export default triggerAfterSet;
