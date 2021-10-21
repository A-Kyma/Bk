import {Class as AstroClass} from 'meteor/jagi:astronomy'
import {check, Match} from 'meteor/check'
import Enum from "../modules/customFields/customs/Enum";
import {User} from "./user";


const Access = Enum.create({
  name: "BkRoleAccess",
  identifiers: ["SuperAdministrator", "Administrator", "Member", "User"]
})

const roles = new Mongo.Collection("roles");
const Role = AstroClass.create({
  name: "Role",
  collection: roles,
  fields: {
    user: {type: User},
    access: {type: Access},
    className: {type: String, optional: true},
    classId: {type: String, optional: true},
    classOptions: {type: Object, optional: true}
  },
  indexes: {
    userClass: {
      fields: {
        user: 1,
        className: 1,
        classId: 1
      },
      options: {unique: true}
    },
    modelAccess: {
      fields: {
        user: 1,
        className: 1,
        access: 1
      }
    }
  },
});

const isAstroClass = Match.Where((x) => AstroClass.includes(x))
const isAstroClassInstance = Match.Where((x) => x && AstroClass.includes(x.constructor))

/***
 * @description function taking a model/Class and return selector for this class and it's children
 * @param {Class|Class.prototype} model
 * @returns {String|{$in}}
 */
function getClassNameSelector(model) {
  let Class = model
  if (Match.test(model,isAstroClassInstance)) Class = model.constructor
  check(Class,isAstroClass)

  if (Class.children) {
    let result = Class.children.map(x => x.getName())
    result.push(Class.getName())
    return {$in: result}
  } else {
    return Class.getName()
  }

}

/***
 * @description returns the selector used for Role.check (in roles collection)
 * @param model Astroclass instance
 * @param user user
 * @returns MongoDB roles collection selector
 */
function getSelector(model,user) {
  let selector
  if (Match.test(model, isAstroClassInstance) && Match.test(model._id, String)) {
    selector = {
      $or: [
        {
          $and: [{
            className: getClassNameSelector(model),
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
    selector = {
      $and: [{
        className: {$exists: false},
        classId: {$exists: false},
      }]
    }
  }

  if (typeof user === "string") {
    selector.user = user;
  } else {
    selector.user = user && user._id || Meteor.userId();
  }

  return selector
}

/***
 * @description return role user has for Class
 * @param model Astroclass instance
 * @param user user (logged in user by default)
 * @returns {Role}
 */
Role.getRole = function (model, user=Meteor.userId()) {
  if (Match.test(user,null)) return
  check(model, Match.Maybe(isAstroClassInstance))
  check(user, Match.OneOf(isAstroClassInstance, String))

  let selector = getSelector(model,user);

  let role = Role.findOne(selector, {fields: {access: 1}});

  // If role is undefined for this model,
  // let check roles in subModels (external relations)
  // And send first one found back
  if (!role && model && typeof model.getBelongsToRelations === "function") {
    model.getBelongsToRelations().some(field => {
      let definition = model.getDefinition(field)
      let subModel = definition.relation && new (definition.relation)()
      subModel._id = model.get(field)
      selector = getSelector(subModel,user);
      role = Role.findOne(selector, {fields: {access: 1}});
      return role
    })
  }
  return role;
}

/***
 * @description returns access user has for Class
 * @param model Astroclass instance
 * @param user user
 * @returns {Role.access}
 */
Role.check = function (model, user=Meteor.userId()) {
  let role = Role.getRole(model,user)
  return role && role.access;
}

/***
 * @description Tells if user has at least the access asked for this class.
 * @param access one of "SuperAdministrator", "Administrator", "Member", "User"
 * @param model Astronomy class instance
 * @param user user for which we check
 * @returns {true|false}
 ***/
Role.is = function (access, model, user=Meteor.userId(), options={}) {
  let AccessClass = Role.getFieldClass("access")
  if (!user) return false
  check(model, Match.Maybe(isAstroClassInstance))
  check(user, Match.OneOf(isAstroClassInstance, String))

  if (model && typeof model.isRole === "function") {
    let userId
    if (typeof user === "string") {
      userId = user
    } else {
      userId = user && user._id || Meteor.userId();
    }
    let isRole = model.isRole(access,userId,options)
    if (isRole)
      return isRole
    else
      return Role.is("SuperAdministrator",undefined,user)
  }

  const role = Role.check(model, user);

  if (role === undefined) return false

  let indexRole = AccessClass.getIdentifiers().indexOf(role.access);
  let indexAccess = AccessClass.getIdentifiers().indexOf(access);

  return indexRole <= indexAccess;
}

/***
 * @description Returns Class Ids where user is at least at role of access
 * @param access minimum role access required
 * @param Class AstroClass we ask for
 * @param user user we ask for (Meteor.userId()
 * @returns {Array.<AstroClass._id>}
 */
Role.getClassIds = function (access, Class, user=Meteor.userId()) {
  let AccessClass = Role.getFieldClass("access")
  if (Match.test(user,null)) return []
  check(Class, isAstroClass)
  check(user, Match.OneOf(isAstroClass, String))
  check(access, Match.Where((x) => {
    check(access, String);
    return AccessClass.getIdentifiers().includes(access);
  }));

  if (Role.is("SuperAdministrator"))
      return Class.find().map(r=>r._id);

  let indexAccess = AccessClass.getIdentifiers().indexOf(access);
  let authorizedAccess = AccessClass.getIdentifiers().slice(0,indexAccess+1)

  let selector = {
    className: getClassNameSelector(Class),
    user,
    access: {$in: authorizedAccess}
  };

  return Role.find(selector,{fields: {classId: 1}}).map(e=>e.classId)
}

Role.handler = undefined

export default Role;

if (Meteor.isClient) {
  Tracker.autorun(() => {
    Role.handler = Meteor.subscribe("myRoles")
  })

}
