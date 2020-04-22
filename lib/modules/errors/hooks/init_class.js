import _xor from 'lodash/xor';
import _isEmpty from 'lodash/isEmpty';
import { ReactiveVar } from 'meteor/reactive-var'
import getError from "../class_prototype_methods/getError";
import setError from "../class_prototype_methods/setError";
import clearError from "../class_prototype_methods/clearError";

function onInitClass(Class, className) {
  // Class prototype methods.
  Class.prototype._errors=new ReactiveVar([],function(oldValue,newValue) { return _isEmpty(_xor(oldValue,newValue))})
  Class.prototype.setError=setError;
  Class.prototype.getError=getError;
  Class.prototype.clearError=clearError;
};

export default onInitClass;