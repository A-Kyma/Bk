import {Meteor} from "meteor/meteor";
import {Class} from "meteor/jagi:astronomy"
import {check} from "meteor/check"
import {I18n,Lifecycle,Enum,User,Role} from "meteor/akyma:bk"
import { EJSON } from 'meteor/ejson';
import config from "../../lib/core/config";
import _get from "lodash/get"

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

    if (!AstroClass)
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

    let pipeline
    if (!!parameterElement.aggregate) {
      pipeline = EJSON.parse(parameterElement.aggregate)
      if (!Array.isArray(pipeline)) {
        throw Meteor.Error("Bad configuration")
      }
    } else {
      // default project from columns declared
      let project = parameterElement.columns.reduce((acc,col) => {
        return {...acc,[col.key]: 1}
      },{})
      pipeline = [{
        $project: project,
      }]
    }

    // Add filters from Bk-Table
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
        let result = columnKeys.map(key => _get(row,key)) // Allow usage of dotted key
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

    /***
     * Format Enum, Lifecycle and Array of values
     ***/
    const numberOfRows = data.length
    parameterElement.columns.forEach((elem,j) => {
      let applyFormat
      if (["Enum","Lifecycle","Class"].includes(elem.columnType)) {
        let ColumnClass
        let columnClassName = elem[elem.columnType.toLowerCase() + "Type"]
        if (elem.columnType === "Enum")
          ColumnClass = Enum.get(columnClassName)
        if (elem.columnType === "Lifecycle"){
          ColumnClass = Lifecycle.get(columnClassName)
        }
        if (elem.columnType === "Class") {
          ColumnClass = Class.get(columnClassName)
        }
        if (!ColumnClass && typeof ColumnClass.getLabelKey !== "function")
          return

        if (elem.columnType === "Class") {
          // We receive String or Array of Strings (expected this String is an id)
          if (typeof data[0][j] === "string"
          || Array.isArray(data[0][j]) && typeof data[0][j][0] === "string") {
            // need to retrieve all Class beforehands since we have only ids
            let ids = data.flatMap(elem => elem[j]).filter(id => !!id)
            const classInstances = ColumnClass.find({_id: {$in: ids}}).fetch()

            applyFormat = function (cell) {
              if (cell) {
                const classInstance = classInstances.find(instance => instance._id === cell)
                if (elem.classField)
                  return classInstance.get(elem.classField)
                else
                  return typeof classInstance.defaultName === "function" ? classInstance.defaultName() : classInstance._id
              }
            }

          } else {
            // We receive an object so we expect the document has already been retrieved
            applyFormat = function (cell) {
              if (cell) {
                const classInstance = new ColumnClass(cell)
                if (elem.classField)
                  return classInstance.get(elem.classField)
                else
                  return typeof classInstance.defaultName === "function" ? classInstance.defaultName() : classInstance._id
              }
            }
          }
        } else {
          applyFormat = function (cell) {
            if (cell)
              return I18n.get(ColumnClass.getLabelKey(cell),{locale})
          }
        }
      } else {
        applyFormat = function(cell) {
          return cell
        }
      }

      // From line 0 since header not yet included
      for (let i = 0; i < numberOfRows; i++) {
        let cell = data[i][j]
        if (Array.isArray(cell)) {
          cell = cell.map(el => applyFormat(el)).join(", ")
        } else {
          cell = applyFormat(data[i][j])
        }
        data[i][j] = cell
      }
    })

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