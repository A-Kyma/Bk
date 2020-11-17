import { Class } from 'meteor/jagi:astronomy'
import { check,Match } from 'meteor/check'
import Enum from "../modules/customFields/customs/Enum";
import User from "./user";


const Access = Enum.create({
  name: "BkRoleAccess",
  identifiers: ["SuperAdministrator","Administrator","Member","User"]
})

const roles =  new Mongo.Collection("roles");
const Role = Class.create({
  name: "Role",
  collection: roles,
  fields: {
    user: {type: User},
    access: { type: Access },
    className: { type: String, optional: true },
    classId: { type: String, optional: true },
  },
  indexes: {
    userClass: {
      fields:{
        user: 1,
        className: 1,
        classId: 1
      },
      options: { unique: true}
    }
  },
  helpers: {
    check(model,user) {
      check(model,Match.Maybe(Class))
      check(user,Match.OneOf({Class,String}))
      check(model._id,String)

      let selector;
      if (Match.test(model, Class)) {
        selector = {
          $or: [
            {
              $and: [{
                className: model.constructor.getName(),
                classId: model._id,
              }]
            },
            {
              $and: [{
                className: {$exists: false},
                classId: {$exists: false},
              }]
            }
          ]
        };
      } else {
        selector = { $and: [{
            className: {$exists: false},
            classId: {$exists: false},
          }]}
      }
      if (typeof user === "string") {
        selector.user = user;
      }
      else {
        selector.user = user && user._id || Meteor.userId();
      }

      let role = Role.findOne(selector,{fields:{access: 1}});
      return role && role.access;
    },
    is(access,model,user) {
      check(model,Match.Maybe(Class))
      check(user,Match.OneOf({Class,String}))
      check(access,Match.where((x) => {
        check(access,String);
        return Access.getIdentifiers().includes(access);
      }));

      const role = this.check(model,user);

      let indexRole = Access.getIdentifiers().indexOf(role.access);
      let indexAccess = Access.getIdentifiers().indexOf(access);

      return indexRole <= indexAccess;
    }
  }
});

export default Role;