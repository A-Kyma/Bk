import {Accounts} from "meteor/accounts-base"
import {Meteor} from "meteor/meteor"
import {I18n, DateTime} from "meteor/akyma:bk"
import XlsExportTreatment from "../../lib/utils/XlsExportTreatment";
import * as XLSX from 'xlsx/xlsx.mjs'
import errorPopupMixin from "./errorPopupMixin";

export default {
  mixins: [errorPopupMixin],
  props: {
    exportName: String,
  },
  data() {
    return {
      busy: false
    }
  },
  computed: {
    target() {
      if (Meteor.isCordova) return "_system"
      return "_blank"
    },
  },
  methods: {
    xlsExportUrl(params) {
      const query = new URLSearchParams({
        user: (Meteor.isCordova) ? Meteor.userId() : undefined,
        key: (Meteor.isCordova) ? Accounts._storedLoginToken() : undefined,
        locale: I18n.getLanguage(),
        timeZone: DateTime.getTimeZone(),
        exportName: this.exportName,
        ...params
      })
      return Meteor.absoluteUrl("/webhook/xls/generate.xlsx?" + query.toString())
    },
    async openLink(e,link,params) {
      this.busy = true
      if (Meteor.isCordova && cordova?.InAppBrowser) {
        e.preventDefault()
        cordova.InAppBrowser.open(link, this.target)
        this.busy = false
      } else {
        let rows
        try {
          rows = await Meteor.callAsync("BkXlsExportMethod", params)
        } catch (e) {
          return this.showError(e)
        }
        if (rows) {
          const workbook = XlsExportTreatment(rows,params)
          XLSX.writeFile(workbook, `Export-${this.exportName}.xlsx`, {compression: true});
        }
        this.busy = false
      }
    },
  }
}