import getBelongsToRelations from "../class_prototype_methods/getBelongsToRelations";
import getStaticBelongsToRelations from "../class_static_methods/getBelongsToRelations";

function onInitClass(Class, className) {
  // Class static helpers.
  Class.getBelongsToRelations=getStaticBelongsToRelations
  // Class prototype methods.
  Class.prototype.getBelongsToRelations=getBelongsToRelations

  //Extends:

};

export default onInitClass;