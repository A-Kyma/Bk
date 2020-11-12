import getLabelKey from "../class_static_methods/getLabelKey";
import getPlaceHolderKey from "../class_static_methods/getPlaceHolderKey";

function onInitClass(Class, className) {
  Class.getLabelKey = getLabelKey;
  Class.getPlaceHolderKey = getPlaceHolderKey;

  Class.prototype.getLabelKey = function(field) { this.constructor.getLabelKey(field) }
};

export default onInitClass;