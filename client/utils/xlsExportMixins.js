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
      busy: false,
      locale: I18n.getLanguage(),
      timeZone: DateTime.getTimeZone(),
      route: this.$route.name,
    }
  },
  computed: {
    target() {
      if (Meteor.isCordova) return "_system"
      return "_blank"
    },
    defaultParams() {
      return {
        locale: this.locale,
        timeZone: this.timeZone,
        route: this.route
      }
    }
  },
  methods: {
    xlsExportUrl(params) {
      const query = {
        user: (Meteor.isCordova) ? Meteor.userId() : undefined,
        key: (Meteor.isCordova) ? Accounts._storedLoginToken() : undefined,
        exportName: this.exportName,
        ...this.defaultParams,
        ...params
      }
      for (const [key, value] of Object.entries(query)) {
        if (!value)
          delete query[key]
      }
      const result = new URLSearchParams(query).toString()
      return Meteor.absoluteUrl("/webhook/xls/generate.xlsx?" + result)
    },
    async openLink(e,link,params) {
      this.busy = true
      if (Meteor.isCordova && cordova?.InAppBrowser) {
        e.preventDefault()
        cordova.InAppBrowser.open(link, this.target)
        this.busy = false
      } else {
        let result
        try {
          result = await Meteor.callAsync(
            "BkXlsExportMethod",
            {...this.defaultParams,...params}
          )
        } catch (e) {
          this.busy = false
          return this.showMeteorError(e)
        }
        if (result) {
          const workbook = XlsExportTreatment(result,{...this.defaultParams,...params})
          XLSX.writeFile(workbook, `Export-${this.exportName}.xlsx`, {compression: true});
        }
        this.busy = false
      }
    },
  }
}