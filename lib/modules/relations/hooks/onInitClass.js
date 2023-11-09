import getBelongsToRelations from "../class_prototype_methods/getBelongsToRelations";
import getStaticBelongsToRelations from "../class_static_methods/getBelongsToRelations";

function onInitClass(Class, className) {
  // Class static helpers.
  Class.getBelongsToRelations=getStaticBelongsToRelations
  // Class prototype methods.
  Class.prototype.getBelongsToRelations=getBelongsToRelations

  //Extends:
  Class.extend({
    // New _errors variable has to be set during construction of the model instance
    events: {
      // e.target = upper document, e.currentTarget = nearest Class
      beforeInit(e) {
        e.currentTarget._relations={}
      }
    }
  }, ["events"])
};

export default onInitClass;