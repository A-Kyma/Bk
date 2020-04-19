import _noop from 'lodash/noop';
import _each from 'lodash/noop';

import getStaticDefinition from "../class_static_methods/getDefinition";

import getDefinition from "../class_prototype_methods/getDefinition";
import getDoc from "../class_prototype_methods/getDoc";
import isPersisted from "../class_prototype_methods/isPersisted";

function onInitClass(Class, className) {
  // Class static methods.
  Class.getDefinition = getStaticDefinition;

  // Class prototype methods.
  Class.prototype.getDefinition = getDefinition;
  Class.prototype.getDoc = getDoc;
  Class.prototype.isPersisted = isPersisted;

  //Extends.

};

export default onInitClass;