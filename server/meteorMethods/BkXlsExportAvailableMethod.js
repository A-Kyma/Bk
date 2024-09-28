import {Meteor} from "meteor/meteor";
import {Class} from "meteor/jagi:astronomy"
import {I18n,User,Role} from "meteor/akyma:bk"
import config from "../../lib/core/config";

const BkXlsExportAvailableMethod = async function({route,...params}) {
  if (!this.userId)
    return false

  const parameterTableName = Meteor.settings?.public?.export?.xls?.parameterTable || config.export.xls.parameterTable
  const parameterElementClass = Class.get("ParameterTableElement" + parameterTableName)

  if (!parameterElementClass)
    return false

  const parameterConfig = parameterElementClass.getConfiguration()
  let lowerClassBehind = parameterConfig.classBehind.toLowerCase()
  let idFieldValue = params._id || params.id || lowerClassBehind && params[lowerClassBehind]

  if (!idFieldValue)
    return false

  const parameterElement = parameterElementClass.getParameter({
    field: idFieldValue,
    route
  })

  if (!parameterElement)
    return false

  const AstroClass = Class.get(parameterElement.collectionClass)

  if (!AstroClass || !parameterElement.aggregate)
    return false

  // roles if multiple roles or role if only a single role checked
  const roles = parameterElement.roles || !!parameterElement.role && [parameterElement.role]
  if (Array.isArray(roles)
    && roles.length > 0
    && !!parameterElement.classBehind
  ) {
    const RoleClass = Class.get(parameterElement.classBehind)
    if (!RoleClass) {
      return false
    }

    const RoleClassInstance = RoleClass.findOne({_id: idFieldValue})
    if (!Role.is(roles, RoleClassInstance, this.userId) && !Role.is("SuperAdministrator")) {
      return false
    }
  }

  return true
}

export default BkXlsExportAvailableMethod

Meteor.methods({
  BkXlsExportAvailableMethod(args) {
    return BkXlsExportAvailableMethod.call(this,args)
  }
})