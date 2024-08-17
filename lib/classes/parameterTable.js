import { Class } from 'meteor/akyma:astronomy'
import AstronomyClasses from "../modules/customFields/types/astronomyClasses";
import Role from "./role";
import AstronomyFields from "../modules/customFields/types/astronomyFields";
import ParameterTableOption from "./parameterTableOption";
import ParameterTableElement from "./parameterTableElement";
import Enum from "../modules/customFields/customs/Enum";
import Textarea from "../modules/customFields/classes/Textarea";

const parameterTable = new Mongo.Collection("parameterTables");
const ParameterTable = Class.create({
  name: "ParameterTable",
  collection: parameterTable,
  secured: false,
  fields: {
    name: { type: String, unique: true },
    description: { type: Textarea, optional: true },
    classBehind: {
      type: AstronomyClasses,
      optional: true,
      ui: {
        template: "BkBelongsToMany"
      },
    },
    field: {
      type: AstronomyFields,
      optional(doc) { return !doc.classBehind },
      ui: {
        template: "BkBelongsToMany"
      },
      canView({doc}) { return !!doc.classBehind }
    },
    multipleChoice: {
      type: Boolean,
      canView({doc}) { return !!doc.field },
      default: false,
    },
    options: {
      type: [ParameterTableOption],
    }
  },
  permissions: {
    canCreate() { return Role.is("SuperAdministrator")},
    canUpdate() { return Role.is("SuperAdministrator")},
    canDelete() { return Role.is("SuperAdministrator")},
  },
  events: {
    afterInit(e) {
      const doc = e.target
      if (doc.classBehind && (!e.fields || e.fields.includes("classBehind"))) {
        let definition = doc.getDefinition("field")
        definition.type.class.setClass(doc.classBehind)
      }
    },
    afterValidate(e) {
      const doc = e.target
      if (doc.classBehind && (!e.fields || e.fields.includes("classBehind"))) {
        let definition = doc.getDefinition("field")
        definition.type.class.setClass(doc.classBehind)
      }
    },
    afterInsert(e) {
      const doc=e.target
      ParameterTableElement.createChild(doc)
    },
    afterUpdate(e) {
      const doc=e.target
      ParameterTableElement.createChild(doc)
    }
  }
})


if (Meteor.isServer) {
  Meteor.startup(() =>
      ParameterTable.find().forEach(
        (doc) => ParameterTableElement.createChild(doc))
  )
}




export default ParameterTable