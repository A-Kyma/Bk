import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base"
import {check} from "meteor/check"
import {I18n,User} from "meteor/akyma:bk"
import * as XLSX from 'xlsx/xlsx.mjs'

// see webhook xlsWebhook
Meteor.methods({
  async BkXlsExportMethod(args) {
    const { locale, timeZone, method,...params } = args
    if (!method) throw new Meteor.Error("Service unknown")

    if (!this.userId) throw new Meteor.Error("You are not logged in.")

    const user = await Meteor.users.findOneAsync(this.userId)

    if (!user) throw new Meteor.Error("You are not logged in.")

    //let rows = [{name: "test", value: "25", date: new Date() }]

    let rows
    try {
      rows = await Meteor.callAsync(method, {
        user,
        locale,
        timeZone,
        ...params,
      })
    } catch (e) {
      throw new Meteor.Error("Service unknown")
    }

    if (rows.length === 0)
      throw new Meteor.Error("")

    return rows
  }
})