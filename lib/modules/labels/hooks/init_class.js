import getLabelKey from "../class_static_methods/getLabelKey";
import getPlaceHolderKey from "../class_static_methods/getPlaceHolderKey";

function onInitClass(Class, className) {
  Class.getLabelKey = getLabelKey;
  Class.getPlaceHolderKey = getPlaceHolderKey;
};

export default onInitClass;