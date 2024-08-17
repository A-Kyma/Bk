import { Behavior } from 'meteor/akyma:astronomy';
import { User } from "../../classes/user";
import Meta from "../../classes/meta";
import DateTime from "../customFields/classes/DateTime";

Behavior.create({
  name: 'audit',
  options: {
    field: 'meta',
    canView: false,
    noFilter: true,
    timeZone: false,
  },
  createClassDefinition: function() {
    let options = this.options
    const definition = {
      fields: {  },
      events: {
        afterInit: (e) => {
          const doc = e.currentTarget
          if (Meteor.isClient && options.timeZone && !!doc[this.options.field]) {
            this.setTimeZone(doc)
          }
        },
        beforeInsert: (e) => {
          if (Meteor.isServer) {
            //if (e.trusted) return
            const doc = e.currentTarget;
            if (e.fields && Array.isArray(e.fields) && !e.fields.includes(this.options.field))
              e.fields.push(this.options.field)
            this.setCreationDate(doc);
            this.setCreationUser(doc);
          }
        },
        beforeUpdate: (e) => {
          if (Meteor.isServer) {
            //if (e.trusted) return
            const doc = e.currentTarget;
            if (e.fields && Array.isArray(e.fields) && !e.fields.includes(this.options.field))
              e.fields.push(this.options.field)
            this.setModificationDate(doc);
            this.setModificationUser(doc);
          }
        }
      }
    };

    // add definition meta
    definition.fields[options.field] = {
      type: Meta,
      optional: true,
      noFilter: options.noFilter,
      canView(...args) {
        if (typeof options.canView === "function")
          return options.canView(...args)
        else
          return options.canView
      }
    }

    return definition;
  },
  apply: function(Class) {
    Class.extend(this.createClassDefinition(), ['fields', 'events', 'permissions', 'relations']);
  },
  setCreationDate: function(doc) {
    // Get current date.
    const date = new Date();

    // Set value for created field.
    doc[this.options.field].createdAt = date;

    // Set value for the "updatedAt" field.
    doc[this.options.field].updatedAt = date;
  },
  setModificationDate: function(doc) {
    // Get current date.
    const date = new Date();

    // Set value for the "updatedAt" field.
    doc[this.options.field].updatedAt = date;
  },

  setCreationUser: function(doc) {
    try {
      doc[this.options.field].createUser = Meteor.userId();
    } catch {
      doc[this.options.field].createUser = "server";
    }
  },

  setModificationUser: function(doc) {
    try {
      doc[this.options.field].updateUser = Meteor.userId();
    } catch {
      doc[this.options.field].updateUser = "server";
    }
  },

  setTimeZone: function(doc) {
    doc[this.options.field].timeZone = DateTime.getTimeZone()
  }
});