import {Class} from 'meteor/jagi:astronomy';
import XlsExportColumnTypes from "./XlsExportColumnTypes";
import AstronomyEnums from "../modules/customFields/types/astronomyEnums";
import AstronomyLifecycles from "../modules/customFields/types/astronomyLifecycles";

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
      type: XlsExportColumnTypes
    },
    enumType: {
      type: AstronomyEnums,
      ui: {template: "BkBelongsToMany"},
      optional(doc) { return doc.columnType !== "Enum"},
      canView({doc}) { return doc.columnType === "Enum"},
    },
    lifecycleType: {
      type: AstronomyLifecycles,
      ui: {template: "BkBelongsToMany"},
      optional(doc) { return doc.columnType !== "Lifecycle"},
      canView({doc}) { return doc.columnType === "Lifecycle"},
    }
  }
})

export default XlsExportColumnParam