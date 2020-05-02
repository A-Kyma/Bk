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
  Class.prototype.setError = setError;
  Class.prototype.getError = getError;
  Class.prototype.clearError = clearError;
  Class.prototype.isValid = isValid;

  //Extends:
  Class.extend({
    // New _errors variable has to be set during construction of the model instance
    events: {
      // e.target = upper document, e.currentTarget = nearest Class
      beforeInit(e) {
        e.currentTarget._errors = new ReactiveMap({});
      }
    }
  })
};

export default onInitClass;