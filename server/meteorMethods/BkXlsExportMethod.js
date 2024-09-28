import {Meteor} from "meteor/meteor";
import {Class} from "meteor/jagi:astronomy"
import {Accounts} from "meteor/accounts-base"
import {check} from "meteor/check"
import {I18n,User,Role} from "meteor/akyma:bk"
import * as XLSX from 'xlsx/xlsx.mjs'
import { EJSON } from 'meteor/ejson';
import ParameterTableElement from "../../lib/classes/parameterTableElement";
import config from "../../lib/core/config";

// see webhook xlsWebhook

const BkXlsExportMethod = async function(args) {
  const { locale, timeZone, method, route, ...params } = args

  if (!this.userId) throw Meteor.Error("You are not logged in.")
  let user
  if (!this.connection && this.user)
    user = this.user
  else
    user = await Meteor.users.findOneAsync(this.userId)

  if (!user) throw Meteor.Error("You are not logged in.")

  let rows
  //let rows = [{name: "test", value: "25", date: new Date() }]

  if (!method) {
    const parameterTableName = Meteor.settings?.public?.export?.xls?.parameterTable || config.export.xls.parameterTable
    const parameterElementClass = Class.get("ParameterTableElement" + parameterTableName)

    if (!parameterElementClass)
      throw Meteor.Error("Service unknown")

    const parameterConfig = parameterElementClass.getConfiguration()
    let lowerClassBehind = parameterConfig.classBehind.toLowerCase()
    let idFieldValue = params._id || params.id || lowerClassBehind && params[lowerClassBehind]

    if (!idFieldValue)
      throw Meteor.Error("Viewing from the client is not allowed")

    const parameterElement = parameterElementClass.getParameter({
      field: idFieldValue,
      route
    })

    if (!parameterElement)
      throw Meteor.Error("Service unknown")

    const AstroClass = Class.get(parameterElement.collectionClass)

    if (!AstroClass || !parameterElement.aggregate)
      throw Meteor.Error("Bad configuration")

    // roles if multiple roles or role if only a single role checked
    const roles = parameterElement.roles || !!parameterElement.role && [parameterElement.role]
    if (Array.isArray(roles)
      && roles.length > 0
      && !!parameterElement.classBehind
    ) {
      const RoleClass = Class.get(parameterElement.classBehind)
      if (!RoleClass) {
        throw Meteor.Error("Bad configuration")
      }

      const RoleClassInstance = RoleClass.findOne({_id: idFieldValue})
      if (!Role.is(roles, RoleClassInstance, this.userId) && !Role.is("SuperAdministrator")) {
        throw Meteor.Error("Service forbidden")
      }
    }

    let pipeline = EJSON.parse(parameterElement.aggregate)
    if (!Array.isArray(pipeline)) {
      throw Meteor.Error("Bad configuration")
    }

    pipeline.unshift({
      $match: params
    })

    let collection = AstroClass.getCollection().rawCollection()
    rows = await collection.aggregate(pipeline).toArray()

    if (rows.length === 0)
      throw Meteor.Error("noData")

    const numberOfColumns = parameterElement.columns.length
    const allKeysProvided = parameterElement.columns.filter(elem => !!elem.key).length === numberOfColumns
    let data
    if (allKeysProvided) {
      // Ensure column are correctly assigned
      const columnKeys = parameterElement.columns.map(elem => elem.key)
      data = rows.map(row => {
        let result = columnKeys.map(elem => row[elem])
        return result
      })
    } else {
      // Need to use $ifNull to ensure all columns are filled in each row returned
      data = rows.map(row => Object.values(row))
      const dataMinLengthRow = data.reduce(
        (accumulator,currentRow) => Math.min(accumulator, currentRow.length),
        numberOfColumns
      )

      if (dataMinLengthRow !== numberOfColumns) {
        throw Meteor.Error("Bad query")
      }
    }

    return {
      headers: parameterElement.columns,
      data: data
    }

  } else {
    try {
      rows = await Meteor.callAsync(method, {
        user,
        locale,
        timeZone,
        ...params,
      })
    } catch (e) {
      throw Meteor.Error("Service unknown")
    }
  }

  if (rows.length === 0)
    throw Meteor.Error("app.noData")

  return {
    headers: rows.map(
      row => {
        return {
          label: Object.keys(row).map((label) => label.replaceAll("|", "."))
        }
      }),
    data: rows.map(row => Object.values(row))
  }
}

export default BkXlsExportMethod

Meteor.methods({
  BkXlsExportMethod(args) {
    return BkXlsExportMethod.call(this,args)
  }
})