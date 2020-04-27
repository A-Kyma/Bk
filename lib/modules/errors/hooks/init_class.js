import _xor from 'lodash/xor';
import _isEmpty from 'lodash/isEmpty';
import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveMap } from 'meteor/jagi:reactive-map';

import getError from "../class_prototype_methods/getError";
import setError from "../class_prototype_methods/setError";
import clearError from "../class_prototype_methods/clearError";
import isValid from "../class_prototype_methods/isValid";

function onInitClass(Class, className) {
  // Class prototype methods.
  Class.prototype._errors=new ReactiveMap({});
  Class.prototype.setError=setError;
  Class.prototype.getError=getError;
  Class.prototype.clearError=clearError;
  Class.prototype.isValid=isValid;
};

export default onInitClass;