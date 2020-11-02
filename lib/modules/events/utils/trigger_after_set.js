import { Event } from 'meteor/jagi:astronomy';

function triggerAfterSet(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc,
    changes
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
      oldDoc,
      changes
    })
  );
}

export default triggerAfterSet;
