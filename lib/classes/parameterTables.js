import { Class } from 'meteor/jagi:astronomy'
import AstronomyClasses from "../modules/customFields/types/astronomyClasses";
import Role from "./role";

const parameterTables = new Mongo.Collection("parameterTables");
const ParameterTables = Class.create({
  name: "ParameterTables",
  collection: parameterTables,
  secured: false,
  fields: {
    name: { type: String },
    classBehind: {
      type: AstronomyClasses,
      ui: {
        template: "BkBelongsToMany"
      }
    },
    field: {
      type: String
    },
  },
  permissions: {
    canCreate() { return Role.is("SuperAdministrator")},
    canUpdate() { return Role.is("SuperAdministrator")},
    canDelete() { return Role.is("SuperAdministrator")},
  }
})

// Meteor.startup(() => {
//   import("../modules/customFields/types/astronomyClasses").then((AstronomyClassesModule) => {
//     const AstronomyClasses = AstronomyClassesModule.default
//     ParameterTables.extend({
//       fields: {
//         classBehind: { type: AstronomyClasses },
//       }
//     })
//   })
// })

export default ParameterTables