import { Event } from 'meteor/jagi:astronomy';

function triggerBeforeValidate(args) {
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
        oldDoc,
        formModel
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
