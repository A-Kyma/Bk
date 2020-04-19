import traverse from "../../core/utils/traverse";
import { Class } from "meteor/jagi:astronomy";

function getModel(model) {
  if (typeof model === "string") {
    model = Class.get(model) && new (Class.get(model))();
  }
  if (Class.includes(model.constructor)) {
    return model;
  } else {
    return undefined;
  }
}

export default getModel;