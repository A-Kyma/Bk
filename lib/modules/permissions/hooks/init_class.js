import _noop from 'lodash/noop';
import _each from 'lodash/noop';
import canView from "../class_prototype_methods/canView";
import canCreate from "../class_prototype_methods/canCreate";
import canUpdate from "../class_prototype_methods/canUpdate";
import canDelete from "../class_prototype_methods/canDelete";
import canEdit from "../class_prototype_methods/canEdit";

function onInitClass(Class, className) {
  // Class static methods.

  // Class prototype methods.
  Class.prototype.canView = canView;
  Class.prototype.canCreate = canCreate;
  Class.prototype.canUpdate = canUpdate;
  Class.prototype.canEdit = canEdit;
  Class.prototype.canDelete = canDelete;

  //Extends:
  Class.extend({
    secured: false,
    events: {
      // e.target = upper document, e.currentTarget = nearest Class
      beforeInsert(e) {
        if (e.trusted) { return true ;}
        if (!e.target.canCreate()) {
          throw new Meteor.Error(403, "Creating from the client is not allowed");
        }
      },
      beforeUpdate(e) {
        if (e.trusted) { return true ;}
        if (!e.target.canUpdate()) {
          throw new Meteor.Error(403, "Updating from the client is not allowed");
        }
      },
      beforeDestroy(e) {
        if (e.trusted) { return true ;}
        if (!e.target.canDelete()) {
          throw new Meteor.Error(403, "Deleting from the client is not allowed");
        }
      }
    }

  }, ["events","storage"])
};

export default onInitClass;