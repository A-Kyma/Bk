import { Class } from "meteor/akyma:astronomy";

/***
 * @function getClass : send Astro Class if exists
 * @param {Class|String} model - can be String | Class | instanciated class
 * @returns {undefined|Class}
 */
function getClass(model) {
  if (model === undefined) return;

  if (typeof model === "string") {
    if (model.startsWith("ParameterTableElement") && model !== "ParameterTableElement") {
      const ParameterTableElement = Class.get("ParameterTableElement")
      return ParameterTableElement.createChildFromName(model)
    }
    return Class.get(model)
  }

  if (Class.includes(model))
    return model;

  if (Class.includes(model.constructor))
    return model.constructor;

  return undefined;
}

export default getClass;