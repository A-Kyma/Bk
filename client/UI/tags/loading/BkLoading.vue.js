
import {Class} from "meteor/akyma:astronomy"

const _sfc_main = {
  name: "BkLoading",
  props: {
    type: String,
    variant: String,
    fontScale: {
      type: String,
      default: "4"
    }
  }
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { class: "text-center" }
const _hoisted_3 = { key: 1 }
const _hoisted_4 = { class: "text-center" }
const _hoisted_5 = { key: 2 }
const _hoisted_6 = { class: "text-center" }

function render(_ctx, _cache) {
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_b_spinner = _resolveComponent("b-spinner")

  return (_ctx.type==='dots')
    ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createVNode(_component_b_icon, {
            icon: "three-dots",
            animation: "cylon",
            "font-scale": _ctx.fontScale
          }, null, 8 /* PROPS */, ["font-scale"])
        ])
      ]))
    : (_ctx.type==='loading')
      ? (_openBlock(), _createElementBlock("div", _hoisted_3, [
          _cache[0] || (_cache[0] = _createElementVNode("div", { class: "text-center" }, "LOADING", -1 /* CACHED */)),
          _createElementVNode("div", _hoisted_4, [
            _createVNode(_component_b_spinner, {
              variant: "dark",
              type: "grow",
              label: "Spinning"
            }),
            _createVNode(_component_b_spinner, {
              variant: "warning",
              type: "grow",
              label: "Spinning"
            }),
            _createVNode(_component_b_spinner, {
              variant: "danger",
              type: "grow",
              label: "Spinning"
            })
          ])
        ]))
      : (_openBlock(), _createElementBlock("div", _hoisted_5, [
          _createElementVNode("div", _hoisted_6, [
            _createVNode(_component_b_icon, {
              icon: "circle-fill",
              animation: "throb",
              "font-scale": _ctx.fontScale
            }, null, 8 /* PROPS */, ["font-scale"])
          ])
        ]))
}
_sfc_main.render = render;
