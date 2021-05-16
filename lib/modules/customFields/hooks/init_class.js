import _noop from 'lodash/noop';
import _each from 'lodash/noop';
import getClass from "../../classExtension/class_static_methods/getClass";
import getStaticFieldByType from "../class_static_methods/getFieldsByType";
import getFieldsByType from "../class_prototype_methods/getFieldsByType";

function onInitClass(Class, className) {
  // Class static methods.
  Class.getFieldsByType = getStaticFieldByType

  // Class prototype methods.
  Class.prototype.getFieldsByType = getFieldsByType

  //Extends.

};

export default onInitClass;