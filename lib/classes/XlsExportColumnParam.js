import {Class} from 'meteor/jagi:astronomy';
import XlsExportColumnTypes from "./XlsExportColumnTypes";
import AstronomyEnums from "../modules/customFields/types/astronomyEnums";
import AstronomyLifecycles from "../modules/customFields/types/astronomyLifecycles";
import AstronomyClasses from "../modules/customFields/types/astronomyClasses";

const XlsExportColumnParam = Class.create({
  name: 'XlsExportColumnParam',
  fields: {
    label: {
      type: String
    },
    key: {
      type: String,
      optional: true,
    },
    columnType: {
      type: XlsExportColumnTypes,
      sort: true
    },
    enumType: {
      type: AstronomyEnums,
      ui: {template: "BkBelongsToMany"},
      sort: true,
      optional(doc) { return doc.columnType !== "Enum"},
      canView({doc}) { return doc.columnType === "Enum"},
    },
    lifecycleType: {
      type: AstronomyLifecycles,
      ui: {template: "BkBelongsToMany"},
      sort: true,
      optional(doc) { return doc.columnType !== "Lifecycle"},
      canView({doc}) { return doc.columnType === "Lifecycle"},
    },
    classType: {
      type: AstronomyClasses,
      ui: {template: "BkBelongsToMany"},
      sort: true,
      optional(doc) { return doc.columnType !== "Class" },
      canView({doc}) { return doc.columnType === "Class" },
    },
    classField: {
      type: String,
      optional: true,
      canView({doc}) { return doc.columnType === "Class" },
    }
  }
})

export default XlsExportColumnParam