import { Event } from 'meteor/akyma:astronomy';

function triggerBeforeValidate(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "beforeValidate" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeValidate", {
        cancelable: true,
        propagates: false,
        doc,
        stopOnFirstError,
        fields,
        simulation,
        forceUpdate,
        trusted,
        oldDoc
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeValidate"
    });
  }
}

export default triggerBeforeValidate;
