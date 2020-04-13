import getLabelKey from "../class_static_methods/getLabelKey";

function onInitClass(Class, className) {
  Class.getLabelKey = getLabelKey;
};

export default onInitClass;