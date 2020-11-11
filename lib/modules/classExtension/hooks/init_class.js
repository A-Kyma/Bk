import _noop from 'lodash/noop';
import _each from 'lodash/noop';

import getStaticDefinition from "../class_static_methods/getDefinition";
import getFieldsNamesByFilter from "../class_static_methods/getFieldsNamesByFilter";

import getDefinition from "../class_prototype_methods/getDefinition";
import getDoc from "../class_prototype_methods/getDoc";
import isPersisted from "../class_prototype_methods/isPersisted";
import getValue from "../class_prototype_methods/getValue";
import getStaticClass from "../class_static_methods/getClass";
import getClass from "../class_prototype_methods/getClass";
import getHighestParent from "../class_static_methods/getHighestParent";

function onInitClass(Class, className) {
  // Class static methods.
  Class.getDefinition = getStaticDefinition;
  Class.getClass = getStaticClass;
  Class.getHighestParent = getHighestParent;
  Class.getFieldsNamesByFilter = getFieldsNamesByFilter;

  // Class prototype methods.
  Class.prototype.getDefinition = getDefinition;
  Class.prototype.getClass = getClass;
  Class.prototype.getDoc = getDoc;
  Class.prototype.isPersisted = isPersisted;
  Class.prototype.getValue = getValue;

  //Extends.

};

export default onInitClass;