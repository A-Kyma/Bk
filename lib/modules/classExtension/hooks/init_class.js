import _noop from 'lodash/noop';
import _each from 'lodash/noop';

import getStaticDefinition from "../class_static_methods/getDefinition";
import getFieldsNamesByFilter from "../class_static_methods/getFieldsNamesByFilter";
import getImportFieldsClass from "../class_static_methods/getImportFieldsClass";
import getFieldsClassByAttribute from "../class_static_methods/getFieldsClassByAttribute";

import getDefinition from "../class_prototype_methods/getDefinition";
import getDoc from "../class_prototype_methods/getDoc";
import isPersisted from "../class_prototype_methods/isPersisted";
import getValue from "../class_prototype_methods/getValue";
import getStaticFieldClass from "../class_static_methods/getFieldClass";
import getFieldClass from "../class_prototype_methods/getFieldClass";
import getHighestParent from "../class_static_methods/getHighestParent";
import getClass from "../class_static_methods/getClass";

function onInitClass(Class, className) {
  // Class static methods.
  Class.getClass = getClass;
  Class.getDefinition = getStaticDefinition;
  Class.getFieldClass = getStaticFieldClass;
  Class.getHighestParent = getHighestParent;
  Class.getFieldsNamesByFilter = getFieldsNamesByFilter;
  Class.getImportFieldsClass = getImportFieldsClass;
  Class.getFieldsClassByAttribute = getFieldsClassByAttribute

  // Class prototype methods.
  Class.prototype.getDefinition = getDefinition;
  Class.prototype.getFieldClass = getFieldClass;
  Class.prototype.getDoc = getDoc;
  Class.prototype.isPersisted = isPersisted;
  Class.prototype.getValue = getValue;

  //Extends.

};

export default onInitClass;