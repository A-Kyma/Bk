import { Behavior } from 'meteor/jagi:astronomy';
import { User } from "../../classes/user";
import Meta from "../../classes/meta";

Behavior.create({
  name: 'audit',
  options: {
    field: 'meta',
  },
  createClassDefinition: function() {
    const definition = {
      fields: {  },
      events: {
        beforeInsert: (e) => {
          if (Meteor.isServer) {
            //if (e.trusted) return
            const doc = e.currentTarget;
            if (e.fields && !e.fields.includes(this.options.field))
              e.fields.push(this.options.field)
            const Class = doc.constructor;
            this.setCreationDate(doc);
            this.setCreationUser(doc);
          }
        },
        beforeUpdate: (e) => {
          if (Meteor.isServer) {
            //if (e.trusted) return
            const doc = e.currentTarget;
            if (e.fields && !e.fields.includes(this.options.field))
              e.fields.push(this.options.field)
            const Class = doc.constructor;
            this.setModificationDate(doc);
            this.setModificationUser(doc);
          }
        }
      }
    };

    // add definition meta
    definition.fields[this.options.field] = {
      type: Meta,
      optional: true
    }

    return definition;
  },
  apply: function(Class) {
    Class.extend(this.createClassDefinition(), ['fields', 'events','relations']);
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
  }
});