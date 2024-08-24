import Role from "../../lib/classes/role";
import ParameterTables from "../../lib/classes/parameterTable";
import { Counts, publishCount } from "meteor/akyma:publish-counts";
import ParameterTableElements from "../../lib/classes/parameterTableElement";

Meteor.publish("BkParameterTablesPublish", function(selector,options) {
  if (!this.userId) return this.ready()
  if (!Role.is("SuperAdministrator")) return this.ready()

  publishCount(
    this,
    'BkParameterTablesPublish-count',
    ParameterTables.getCollection().find(selector, { fields: { _id: true }}),
    { noReady: true }
  )

  return ParameterTables.getCollection().find(selector,options)
})

Meteor.publish("BkParameterTableElementsPublish", function(selector,options) {
  if (!this.userId) return this.ready()
  //if (!Role.is("SuperAdministrator")) return this.ready()

  publishCount(
    this,
    'BkParameterTableElementsPublish-count',
    ParameterTableElements.getCollection().find(selector, { fields: { _id: true }}),
    { noReady: true }
  )

  return ParameterTableElements.getCollection().find(selector,options)
})

// Add index on type
ParameterTableElements.extend({
  indexes: {
    parameterType: {
      fields: {
        type: 1,
        classBehind: 1,
        field: 1
      },
      options: {
        unique: false
      }
    }
  }
})