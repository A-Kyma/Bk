
/**
 * This component allows to create a list of horizontal icons
 * The aggregate behind needs the below returned json
 *     chartDetails.data = {
 *       labels: labels,
 *       data: res
 *   }
 *   where labels contains: title, variant (rgba color) and icon
 *   res contains icon label and not mandatory tooltip
 */
const _sfc_main = {
  name: "BulletChart",
  data() {
    return {
    }
  },
  props: {
    chartData: {
      //Object contains labels {title, variant (rgba color) and icon[string]} and data result: {icon[string] and not mandatory tooltip}
      type: Object
    },
  },
  methods: {
    getVariant(item){
      let res = item.icon
      let labels = this.chartData.labels
      let label = labels.filter(i => i.icon === res)
      return label[0].variant
    },
  }
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeStyle as _normalizeStyle, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, createBlock as _createBlock, createCommentVNode as _createCommentVNode, withCtx as _withCtx, createVNode as _createVNode } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { class: "mb-2" }
const _hoisted_2 = {
  class: "mr-2",
  style: {"font-size":"14px"}
}
const _hoisted_3 = { style: {"font-size":"2rem"} }

function render(_ctx, _cache) {
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_t = _resolveComponent("t")
  const _component_b_tooltip = _resolveComponent("b-tooltip")
  const _component_b_card = _resolveComponent("b-card")

  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("div", _hoisted_1, [
      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.chartData.labels, (label) => {
        return (_openBlock(), _createElementBlock(_Fragment, null, [
          _createElementVNode("div", {
            class: "chartLabels",
            style: _normalizeStyle('background:'+ label.variant)
          }, null, 4 /* STYLE */),
          _cache[1] || (_cache[1] = _createTextVNode()),
          _createElementVNode("span", _hoisted_2, _toDisplayString(label.title), 1 /* TEXT */)
        ], 64 /* STABLE_FRAGMENT */))
      }), 256 /* UNKEYED_FRAGMENT */))
    ]),
    _createVNode(_component_b_card, null, {
      default: _withCtx(() => [
        _createElementVNode("div", _hoisted_3, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.chartData.data, (item) => {
            return (_openBlock(), _createElementBlock(_Fragment, null, [
              (item.tooltip)
                ? (_openBlock(), _createBlock(_component_b_icon, {
                    key: 0,
                    onClick: _cache[0] || (_cache[0] = $event => (_ctx.show = !_ctx.show)),
                    id: 'tooltip-' + item._id,
                    icon: item.icon,
                    style: _normalizeStyle('background:'+_ctx.getVariant(item)),
                    class: "rounded-circle p-2",
                    variant: "white"
                  }, null, 8 /* PROPS */, ["id", "icon", "style"]))
                : (_openBlock(), _createBlock(_component_b_icon, {
                    key: 1,
                    icon: item.icon,
                    style: _normalizeStyle('background:'+_ctx.getVariant(item)),
                    class: "rounded-circle p-2",
                    variant: "white"
                  }, null, 8 /* PROPS */, ["icon", "style"])),
              (item.tooltip)
                ? (_openBlock(), _createBlock(_component_b_tooltip, {
                    key: 2,
                    show: _ctx.show,
                    target: 'tooltip-' + item._id,
                    placement: "top"
                  }, {
                    default: _withCtx(() => [
                      _createElementVNode("span", null, [
                        _createVNode(_component_t, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(item.tooltip), 1 /* TEXT */)
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1024 /* DYNAMIC_SLOTS */)
                      ])
                    ]),
                    _: 2 /* DYNAMIC */
                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["show", "target"]))
                : _createCommentVNode("v-if", true)
            ], 64 /* STABLE_FRAGMENT */))
          }), 256 /* UNKEYED_FRAGMENT */))
        ])
      ]),
      _: 1 /* STABLE */
    })
  ]))
}
_sfc_main.render = render;
