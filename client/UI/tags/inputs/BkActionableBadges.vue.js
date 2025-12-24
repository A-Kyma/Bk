
// TODO choose variant color or other using actionable badge (it's selected when "focus")
// See https://bootstrap-vue.org/docs/components/badge#actionable-badges
import {Class} from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n";

const _sfc_main = {
  name: "BkActionableBadges",
  props: {
    model: Class,
    field: String,
    options: Array,
    for: String,
    disabled: Boolean,
    state: Boolean,
    value: [String,Array]
  },
  computed: {
    readonly() {
      return this.$props['for'] === "view" || this.disabled
    },
    isArray() {
      return Array.isArray(this.value)
    }
  },
  methods: {
    getClass(itemValue) {
      if (this.isArray && this.value.includes(itemValue))
        return "checked"
      if (itemValue === this.value)
        return "checked"
      return ""
    },
    onClick(item) {
      this.$emit("input",item.value)
      this.model[this.field] = item.value
    }
  },
}


export default _sfc_main;

import { renderSlot as _renderSlot, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, renderList as _renderList, Fragment as _Fragment, mergeProps as _mergeProps, createBlock as _createBlock, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  key: 0,
  class: "mr-1 ml-1"
}
const _hoisted_2 = {
  key: 1,
  class: "form-control-plaintext"
}
const _hoisted_3 = {
  key: 2,
  class: "form-control-plaintext"
}
const _hoisted_4 = {
  key: 3,
  class: "form-control-plaintext"
}

function render(_ctx, _cache) {
  const _component_b_badge = _resolveComponent("b-badge")

  return (_ctx.readonly && !_ctx.isArray && !_ctx.options)
    ? (_openBlock(), _createElementBlock("span", _hoisted_1, [
        _createVNode(_component_b_badge, {
          variant: _ctx.value,
          class: "p-1"
        }, {
          default: _withCtx(() => [
            _renderSlot(_ctx.$slots, "default", {}, () => [
              _cache[0] || (_cache[0] = _createTextVNode("     ", -1 /* CACHED */))
            ])
          ]),
          _: 3 /* FORWARDED */
        }, 8 /* PROPS */, ["variant"]),
        _renderSlot(_ctx.$slots, "after")
      ]))
    : (_ctx.readonly && _ctx.options)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
            return (_openBlock(), _createBlock(_component_b_badge, {
              key: item._id,
              variant: item.variant,
              class: "p-1 mr-1"
            }, {
              default: _withCtx(() => [
                _renderSlot(_ctx.$slots, "default", _mergeProps({ ref_for: true }, {item}), () => [
                  _cache[1] || (_cache[1] = _createTextVNode("     ", -1 /* CACHED */))
                ])
              ]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["variant"]))
          }), 128 /* KEYED_FRAGMENT */)),
          _renderSlot(_ctx.$slots, "after")
        ]))
      : (_ctx.readonly && _ctx.isArray && !_ctx.options)
        ? (_openBlock(), _createElementBlock("div", _hoisted_3, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.value, (variant) => {
              return (_openBlock(), _createBlock(_component_b_badge, {
                key: variant,
                variant: variant,
                class: "p-1 mr-1"
              }, {
                default: _withCtx(() => [
                  _renderSlot(_ctx.$slots, "default", {}, () => [
                    _cache[2] || (_cache[2] = _createTextVNode("     ", -1 /* CACHED */))
                  ])
                ]),
                _: 3 /* FORWARDED */
              }, 8 /* PROPS */, ["variant"]))
            }), 128 /* KEYED_FRAGMENT */)),
            _renderSlot(_ctx.$slots, "after")
          ]))
        : (_openBlock(), _createElementBlock("div", _hoisted_4, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.options, (item, index) => {
              return (_openBlock(), _createBlock(_component_b_badge, {
                key: item.value,
                class: _normalizeClass('ml-1 mr-1 ' + _ctx.getClass(item.value)),
                variant: item.value,
                href: "#",
                onClick: $event => (_ctx.onClick(item))
              }, {
                default: _withCtx(() => [
                  _renderSlot(_ctx.$slots, "default", {}, () => [
                    _createTextVNode(_toDisplayString((index+1).toLocaleString('en', {minimumIntegerDigits: _ctx.options.length.toString().length})), 1 /* TEXT */)
                  ])
                ]),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["class", "variant", "onClick"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
}
_sfc_main.render = render;
