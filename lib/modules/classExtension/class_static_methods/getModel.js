import traverse from "../../core/utils/traverse";
import { Class } from "meteor/akyma:astronomy";

/***
 * @description Function returning instanciated model if it exists
 * @param {String|Class.prototype} model - Astronomy Class or model to instanciate / return
 * @param {Object} [rawDoc] - raw document to be instanciated
 * @returns {Class.prototype} new Class instanciated
 */
function getModel(model,rawDoc) {
  if (model === undefined) {
    throw new Meteor.Error("Model Class is undefined [getModel]: ")
  }

  if (typeof model === "string") {
    model = Class.get(model) && new (Class.get(model))(rawDoc);
    if (!model) return undefined
  }

  if (Class.includes(model.constructor)) {
    return model;
  } else {
    return undefined;
  }
}

export default getModel;