import _noop from 'lodash/noop';
import _each from 'lodash/noop';

import getDefinition from "../class_prototype_methods/getDefinition";
import getDoc from "../class_prototype_methods/getDoc";

function onInitClass(Class, className) {
  // Class static methods.

  // Class prototype methods.
  Class.prototype.getDefinition = getDefinition;
  Class.prototype.getDoc = getDoc;

  //Extends.

};

export default onInitClass;