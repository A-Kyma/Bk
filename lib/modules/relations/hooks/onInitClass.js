import raw from "../class_prototype_methods/raw";

function onInitClass(Class, className) {
  // Class static helpers.

  // Class prototype methods.
//  Class.prototype.astroGet = Class.prototype.get;
  Class.prototype.raw = raw;

  //Extends:
  /*
  Class.extend({
    // New _relations variable has to be set during construction of the model instance
    events: {
      // e.target = upper document, e.currentTarget = nearest Class
      beforeInit(e) {
        e.currentTarget._relations = {};
      }
    }
  }, ["events"])
   */
};

export default onInitClass;