
import {Class} from "meteor/akyma:astronomy"

const _sfc_main = {
  name: "BkParameterTableElements",
  methods: {
    exclude(model) {
      if (model.classBehind)
        return ['_id','type','field']
      else
        return ['_id','type','classBehind','field','fieldValue']
    },
    isSubClass(model,field) {
      const definition = model.getDefinition(field)
      if (!definition) return false
      if (Class.includes(definition.type.class)) return true
      return false
    }
  },
}


export default _sfc_main;

import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, createBlock as _createBlock, withCtx as _withCtx, createVNode as _createVNode } from "vue"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { key: 1 }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bk_view_inner = _resolveComponent("bk-view-inner")
  const _component_bk_table = _resolveComponent("bk-table")
  const _component_bk_page = _resolveComponent("bk-page")

  return (_openBlock(), _createBlock(_component_bk_page, {
    model: "ParameterTable",
    subscription: "BkParameterTablesPublish",
    params: [{'_id': _ctx.$route.params.id }]
  }, {
    default: _withCtx(({model}) => [
      _createVNode(_component_bk_table, {
        model: 'ParameterTableElement' + _ctx.$route.params.name,
        actions: ['add','view','update','delete','back'],
        subscription: "BkParameterTableElementsPublish",
        exclude: $options.exclude(model),
        "modal-exclude": $options.exclude(model),
        "label-cols-sm": "3",
        size: "lg",
        "update-route": "",
        filter: {
            'type': 'ParameterTableElement' + _ctx.$route.params.name,
            'classBehind': model.classBehind,
            'field': model.field
          },
        sort: {'name': 1}
      }, {
        "cell()": _withCtx(({model,index,field}) => [
          (Array.isArray(model[field]) && $options.isSubClass(model,field))
            ? (_openBlock(), _createElementBlock("span", _hoisted_1, _toDisplayString(model[field].length), 1 /* TEXT */))
            : (typeof model[field] === 'string' && model[field].length > 25)
              ? (_openBlock(), _createElementBlock("span", _hoisted_2, _toDisplayString(model[field].substring(0,20)) + "... ", 1 /* TEXT */))
              : (_openBlock(), _createBlock(_component_bk_view_inner, {
                  key: 2,
                  "no-label": "",
                  model: model,
                  field: field
                }, null, 8 /* PROPS */, ["model", "field"]))
        ]),
        _: 2 /* DYNAMIC */
      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "exclude", "modal-exclude", "filter"])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["params"]))
}
_sfc_main.render = render;
