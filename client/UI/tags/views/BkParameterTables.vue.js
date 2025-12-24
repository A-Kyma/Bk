
import {Class} from "meteor/akyma:astronomy"
import {I18n} from "meteor/akyma:bk"

const _sfc_main = {
  name: "BkParameterTables",
  methods: {
    getI18n(key){
      return I18n.get(key)
    },
  }
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_bk_button_icon = _resolveComponent("bk-button-icon")
  const _component_bk_table = _resolveComponent("bk-table")

  return (_openBlock(), _createBlock(_component_bk_table, {
    model: "ParameterTable",
    actions: ['add','view','update','delete','back'],
    subscription: "BkParameterTablesPublish",
    fields: ['name','classBehind'],
    "label-cols-sm": "3",
    size: "lg",
    "update-route": "",
    sort: {'name':1}
  }, {
    customActions: _withCtx((data) => [
      _createVNode(_component_bk_button_icon, {
        model: data.model,
        icon: "list-ol",
        variant: "primary",
        route: "AdminParameterTableElements",
        params: {'name': data.model.name},
        title: _ctx.getI18n('ParameterTableOption.summary.label'),
        class: "float-right"
      }, null, 8 /* PROPS */, ["model", "params", "title"])
    ]),
    _: 1 /* STABLE */
  }))
}
_sfc_main.render = render;
