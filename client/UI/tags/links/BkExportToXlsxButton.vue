<template>
  <b-overlay
    :show="busy"
    rounded
    opacity="0.6"
    spinner-small
    :spinner-variant="variant"
    class="d-inline-block"
  >
    <b-button
      v-if="isAvailable"
      :disabled="busy"
      :variant="variant"
      :target="target"
      :href="xlsLink"
      @click.prevent="openLink($event,xlsLink,{method,...params})"
      v-bind="$attrs"
    >
      <b-icon-file-earmark-excel aria-hidden="true"/>
      <t>app.export</t>
    </b-button>

    <bk-button-icon v-else-if="fromBkTable && !isCordova"
                    label="app.export"
                    for="export"
                    v-bind="$attrs"
                    @export="$emit('export',$event)"
    />
  </b-overlay>
</template>

<script>
import {Accounts} from "meteor/accounts-base"
import {Meteor} from "meteor/meteor"
import {EJSON} from "meteor/ejson"
import {I18n, DateTime} from "meteor/akyma:bk"
import XlsExportTreatment from "../../../../lib/utils/XlsExportTreatment";
import {writeFile} from 'xlsx/xlsx.mjs'
import errorPopupMixin from "../../../utils/errorPopupMixin";
import BkButtonIcon from "./BkButtonIcon.vue";

export default {
  name: "BkExportToXlsxButton",
  components: {BkButtonIcon},
  mixins: [errorPopupMixin],
  props: {
    params: Object,
    method: String,
    exportName: {
      type: String,
      default() { return this.$route.name + '-' + new Date().toISOString() },
    },
    fromBkTable: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: "dark"
    },
  },
  async created() {
    this.isAvailable = await Meteor.callAsync(
      "BkXlsExportAvailableMethod",
      {...this.defaultParams,method: this.method, ...this.params}
    )
  },
  data() {
    return {
      isAvailable: undefined,
      busy: false,
      locale: I18n.getLanguage(),
      timeZone: DateTime.getTimeZone(),
      route: this.$route.name,
    }
  },
  computed: {
    isCordova() {
      return Meteor.isCordova
    },
    xlsLink() {
      if (true || Meteor.isCordova) {
        let result = {
          route: this.$route.name
        }
        if (this.method)
          result.method = this.method

        return this.xlsExportUrl({...result, ...this.params})
      }
    },
    target() {
      if (Meteor.isCordova) return "_system"
      if (Meteor.isDesktop) return ""
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
        user: (true || Meteor.isCordova) ? Meteor.userId() : undefined,
        key: (true || Meteor.isCordova) ? Accounts._storedLoginToken() : undefined,
        exportName: this.exportName,
        ...this.defaultParams,
        ...params
      }
      for (const [key, value] of Object.entries(query)) {
        if (!value)
          delete query[key]
      }
      const result = new URLSearchParams({filter: EJSON.stringify(query)}).toString()
      return Meteor.absoluteUrl("/webhook/xls/generate.xlsx?" + result)
    },
    async openLink(e,link,params) {
      this.busy = true
      if (true || Meteor.isCordova && cordova?.InAppBrowser) {
        //e.preventDefault()
        //cordova.InAppBrowser.open(link, this.target)
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
          writeFile(workbook, `Export-${this.exportName}.xlsx`, {compression: true});
        }
        this.busy = false
      }
    },
  }
}
</script>

<style scoped>

</style>