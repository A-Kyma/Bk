import _noop from 'lodash/noop';
import _each from 'lodash/noop';

import set from "../class_prototype_methods/set";
import validate from "../class_prototype_methods/validate";

function onInitClass(Class, className) {
  // Class static methods.

  // Class prototype methods.
  Class.prototype.astroSet = Class.prototype.set;
  Class.prototype.set = set;

  Class.prototype.astroValidate = Class.prototype.validate;
  Class.prototype.validate = validate;

  //Extends:

};

export default onInitClass;