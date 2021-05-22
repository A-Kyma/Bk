import traverse from "../../core/utils/traverse";
import { Class } from "meteor/jagi:astronomy";

function getModel(model) {
  if (model === undefined) {
    throw new Meteor.Error("Model Class is undefined : " + model);
  }

  if (typeof model === "string") {
    model = Class.get(model) && new (Class.get(model))();
    if (!model) return undefined
  }

  if (Class.includes(model.constructor)) {
    return model;
  } else {
    return undefined;
  }
}

export default getModel;