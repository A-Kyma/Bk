import _each from 'lodash/each';
import { ObjectField, ListField } from 'meteor/jagi:astronomy';
import { Class as AstroClass } from 'meteor/jagi:astronomy';
//import Lifecycle from "../customs/Lifecycle"; /!\ cycling import occured

function onApplyDefinition(Class, parsedDefinition, className) {
  /***
   * Add default for:
   * Array : default() { return [] }
   * Object : default() { return {} }
   * Boolean (if optional) : default: false
   * Lifecycle : default: _inialValue_of_the_lifecycle_
   ***/
  _each(Class.schema.fields,(fieldDefinition, fieldName) => {
    if (!fieldDefinition.default) {
      const fieldClass = fieldDefinition.type.class
      // if object (like subclass), we create default empty object : {}
      if (fieldDefinition instanceof ObjectField) {
         fieldDefinition.default = function() { return {}};
      }
      // if array of anything, we create default array : []
      if (fieldDefinition instanceof ListField) {
        fieldDefinition.default = function() { return []};
      }
      // if Boolean, we create default value : False if mandatory. undefined if optional
      if (fieldClass === Boolean
      && !fieldDefinition.optional) {
        fieldDefinition.default = false;
      }
      // if Lifecycle, we create default value

      if (typeof fieldClass.getClassName === "function" &&
        fieldClass.getClassName() === "Lifecycle") {
        fieldDefinition.default = fieldClass.getDefault();
      }
    }

    // Management of isActive field
    if (fieldName === "isActive") {
      Class.extend({
        /**
         * arg contains:
         * doc : current doc checked (nested doc)
         * field : current field checked
         * value : doc[field]
         */
        permissions: {
          canView(arg) {
            let typeField = arg.doc.constructor.getTypeField();
            return arg.doc.isActive || arg.field === "isActive" || (typeField && arg.field === typeField);
          }
        },
        events: {
          beforeSave(e) {
            // /!\ beforeSave Event is called from top document to deepest one
            if (e.doc.constructor.getName() !== Class.getName()) return;
            if (!e.doc.isActive) {
              let Class = e.doc.constructor;
              Class.getFieldsNames().forEach(fieldName => {
                e.doc.set(fieldName,undefined,{
                  "defaults": true
                });
              });
            }
          }
        }
      },["permissions","events"])
    }

    // Management of exist field
    if (fieldName === "exist") {
      Class.extend({
        /**
         * arg contains:
         * doc : current doc checked (nested doc)
         * field : current field checked
         * value : doc[field]
         */
        permissions: {
          canView(arg) {
            let typeField = arg.doc.constructor.getTypeField();
            return arg.doc.exist === "yes" || arg.field === "exist" || (typeField && arg.field === typeField);
            /*
            if (arg.field === "exist" || (typeField && arg.field === typeField)){
              if (arg.doc.exist === "yes"){
                return true
              }else{
                return false
              }
            }*/
          }
        }
      },["permissions","events"])
    }

    // Management of array fields. If array of Class, add _id that will be generated at init
    // This field is necessary to ensure correct component management in VueJS (used as key in for loops)
    if (fieldDefinition instanceof ListField) {
      let subClass = fieldDefinition.type.class;
      if (AstroClass.includes(subClass)
         && !subClass.getField("_id")) {
        subClass.extend({
          //Removed to avoid to have it in the Object.raw() method. So getModified() works better
          //fields: { _id: { type: Mongo.ObjectID, transient: true, canView() { return false }}},
          events: {
            afterInit(e) {
              const doc = e.currentTarget;
              if (!doc._id) doc._id = new Mongo.ObjectID().valueOf()
            }
          }
        },["fields","permissions","events"])
      }
    }
  })
};

export default onApplyDefinition;