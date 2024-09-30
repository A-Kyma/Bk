import { WebApp } from 'meteor/webapp'
import {Meteor} from "meteor/meteor";
import {EJSON} from "meteor/ejson"
import {Accounts} from "meteor/accounts-base"
import {check} from "meteor/check"
import {write} from 'xlsx/xlsx.mjs'
import XlsExportTreatment from "../../lib/utils/XlsExportTreatment";
import BkXlsExportMethod from "../meteorMethods/BkXlsExportMethod";

// see https://docs.sheetjs.com/docs/
// see https://docs.sheetjs.com/docs/getting-started/examples/export/
// see https://docs.sheetjs.com/docs/solutions/output/
// Use xlsExportMixins
// See method BkXlsExportMethod
Meteor.startup(() => {
  WebApp.connectHandlers.use(
    '/webhook/xls/generate.xlsx',
    async (req, res, next) => {
      const {filter} = req.query;
      const { user, key, exportName, ...params } = EJSON.parse(filter)

      let token = Accounts._hashLoginToken(key)
      check(token,String)

      const User = await Meteor.users.findOneAsync({
        _id: user,
        "services.resume.loginTokens.hashedToken": token,
      })

      if (!User) return sendError(401,res)

      //let rows = [{name: "test", value: "25", date: new Date() }]

      let result
      try {
        result = await BkXlsExportMethod.call({userId: user, user: User}, params)
      // try {
      //   rows = await Meteor.callAsync(method, {
      //     user: User,
      //     locale,
      //     timeZone,
      //     ...params,
      //   })
      } catch (e) {
        return sendError(500, res)
      }

      if (result.length === 0)
        return sendError(416, res)

      const filename = `Export-${exportName}.xlsx`
      res.writeHead(200, {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=" + filename
      })

      // Extract from MongoDB, in an array of fields (non embedded)

      const workbook = XlsExportTreatment(result, params)

      const buf = write(workbook, {type: "buffer", bookType: 'xlsx'})

      res.end(buf)

    }
  )
})

const sendError = function(error, res) {
  res.writeHead(error)
  return res.end()
}