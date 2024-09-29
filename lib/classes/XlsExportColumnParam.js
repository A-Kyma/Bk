import {Class} from 'meteor/jagi:astronomy';
import XlsExportColumnTypes from "./XlsExportColumnTypes";
import AstronomyEnums from "../modules/customFields/types/astronomyEnums";
import AstronomyLifecycles from "../modules/customFields/types/astronomyLifecycles";
import AstronomyClasses from "../modules/customFields/types/astronomyClasses";

const XlsExportColumnParam = Class.create({
  name: 'XlsExportColumnParam',
  fields: {
    key: {
      type: String,
      optional(doc,formModel) {
        return formModel?.columns?.filter(col => !!col.key).length <= 0;
      },
    },
    label: {
      type: String
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
      optional(doc) {
        if (doc.classType) {
          const CollectionClass = Class.get(doc.classType)
          if (!CollectionClass) return true
          return typeof CollectionClass.prototype.defaultName === "function"
        }
        return true
      },
      canView({doc}) { return doc.columnType === "Class" },
    }
  },
  events: {
    afterValidate(e) {
      const doc = e.target
      const formModel = e.formModel

      if (!formModel?.collectionClass || !Array.isArray(e.fields))
        return

      let field = e.fields[0]
      let value = doc.get(field)

      if (field !== "key")
        return

      const CollectionClass = Class.get(formModel.collectionClass)
      if (!CollectionClass || !CollectionClass.hasField(value))
        return

      let label = CollectionClass.getLabelKey(value)
      if (!label)
        return

      doc.set("label",label)

      let definition = CollectionClass.getDefinition(value)

      let columnType = XlsExportColumnTypes.getFromDefinition(definition)

      if (!columnType)
        return

      doc.set("columnType",columnType)

      if (columnType === "Class" && !!definition.relation) {
        const ColumnClass = definition.relation
        doc.set("classType",definition.relation.getName())
      }

      if (columnType === "Enum")
        doc.set("enumType", definition.type.class.getName())

      if (columnType === "Lifecycle")
        doc.set("lifecycleType", definition.type.class.getName())
    }
  }
})

export default XlsExportColumnParam