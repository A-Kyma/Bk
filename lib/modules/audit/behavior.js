import { Behavior } from 'meteor/jagi:astronomy';
import { User } from "../../classes/user";

Behavior.create({
  name: 'timestamp',
  options: {
    createdFieldName: 'createdAt',
    updatedFieldName: 'updatedAt',
    createdUser: 'createUser',
    updatedUser: 'updateUser'
  },
  createClassDefinition: function() {
    const definition = {
      fields: {},
      events: {
        beforeInsert: (e) => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setCreationDate(doc);
          this.setCreationUser(doc);
        },
        beforeUpdate: (e) => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setModificationDate(doc);
          this.setModificationUser(doc);
        }
      }
    };

    // Add a field for storing a creation date.
    definition.fields[this.options.createdFieldName] = {
      type: Date,
      immutable: true,
      optional: true
    }

    // Add a field for storing an update date.
    definition.fields[this.options.updatedFieldName] = {
      type: Date,
      optional: true
    }

    definition.fields[this.options.createdUser] = {
      type: User,
      immutable: true,
      optional: true
    }

    definition.fields[this.options.updatedUser] = {
      type: User,
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
    doc[this.options.createdFieldName] = date;

    // Set value for the "updatedAt" field.
    doc[this.options.updatedFieldName] = date;
  },
  setModificationDate: function(doc) {
    // Get current date.
    const date = new Date();

    // Set value for the "updatedAt" field.
    doc[this.options.updatedFieldName] = date;
  },

  setCreationUser: function(doc) {
    doc[this.options.createdUser] = Meteor.userId();
  },

  setModificationUser: function(doc) {
    doc[this.options.updatedUser] = Meteor.userId();
  }
});