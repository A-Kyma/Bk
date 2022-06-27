import Role from "../../lib/classes/role";
import ParameterTables from "../../lib/classes/parameterTables";
import { Counts, publishCount } from "meteor/tmeasday:publish-counts";

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