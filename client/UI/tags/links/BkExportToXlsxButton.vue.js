
import {Accounts} from "meteor/accounts-base"
import {Meteor} from "meteor/meteor"
import {EJSON} from "meteor/ejson"
import {I18n, DateTime} from "meteor/akyma:bk"
import XlsExportTreatment from "../../../../lib/utils/XlsExportTreatment";
import {writeFile} from 'xlsx/xlsx.mjs'
import errorPopupMixin from "../../../utils/errorPopupMixin";
import BkButtonIcon from "./BkButtonIcon.vue.js";

const _sfc_main = {
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
      if (Meteor.isCordova) {
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
      const result = new URLSearchParams({filter: EJSON.stringify(query)}).toString()
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
          writeFile(workbook, `Export-${this.exportName}.xlsx`, {compression: true});
        }
        this.busy = false
      }
    },
  }
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, createTextVNode as _createTextVNode, withCtx as _withCtx, withModifiers as _withModifiers, mergeProps as _mergeProps, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_b_icon_file_earmark_excel = _resolveComponent("b-icon-file-earmark-excel")
  const _component_t = _resolveComponent("t")
  const _component_b_button = _resolveComponent("b-button")
  const _component_bk_button_icon = _resolveComponent("bk-button-icon")
  const _component_b_overlay = _resolveComponent("b-overlay")

  return (_openBlock(), _createBlock(_component_b_overlay, {
    show: _ctx.busy,
    rounded: "",
    opacity: "0.6",
    "spinner-small": "",
    "spinner-variant": _ctx.variant,
    class: "d-inline-block"
  }, {
    default: _withCtx(() => [
      (_ctx.isAvailable)
        ? (_openBlock(), _createBlock(_component_b_button, _mergeProps({
            key: 0,
            disabled: _ctx.busy,
            variant: _ctx.variant,
            target: _ctx.target,
            href: _ctx.xlsLink,
            onClick: _cache[0] || (_cache[0] = _withModifiers($event => (_ctx.openLink($event,_ctx.xlsLink,{method: _ctx.method,..._ctx.params})), ["prevent"]))
          }, _ctx.$attrs), {
            default: _withCtx(() => [
              _createVNode(_component_b_icon_file_earmark_excel, { "aria-hidden": "true" }),
              _createVNode(_component_t, null, {
                default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                  _createTextVNode("app.export", -1 /* CACHED */)
                ]))]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          }, 16 /* FULL_PROPS */, ["disabled", "variant", "target", "href"]))
        : (_ctx.fromBkTable && !_ctx.isCordova)
          ? (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
              key: 1,
              label: "app.export",
              for: "export"
            }, _ctx.$attrs, {
              onExport: _cache[1] || (_cache[1] = $event => (_ctx.$emit('export',$event)))
            }), null, 16 /* FULL_PROPS */))
          : _createCommentVNode("v-if", true)
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["show", "spinner-variant"]))
}
_sfc_main.render = render;
