import { Event } from 'meteor/jagi:astronomy';

function triggerBeforeSet(args) {
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
  // Trigger the "beforeSet" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeSet", {
        cancelable: true,
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
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeSet"
    });
  }
}

export default triggerBeforeSet;
