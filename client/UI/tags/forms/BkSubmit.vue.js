
  import {Class} from 'meteor/akyma:astronomy';

  const _sfc_main = {
    name: "BkSubmit",
      props: {
        for: String,
        toast: Boolean,
        excludeButtons: { type: Array, default() {return []}},
      },
    computed: {
      name() {
        return this.data;
      },
      submit() {
        if (this.for) {
          return "app." + this.for;
        }
        return "app.submit";
      }
    },
    methods: {
      onCancel(e) {
        this.$emit('cancel',e);
      }
    },
    meteor: {

    }
  }


export default _sfc_main;

import { toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createVNode as _createVNode, renderSlot as _renderSlot, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { class: "mt-2" }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_b_button = _resolveComponent("b-button")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (_ctx.$props['for'] !== 'view' && !$props.excludeButtons.includes('submit'))
      ? (_openBlock(), _createBlock(_component_b_button, {
          key: 0,
          type: "submit",
          variant: "outline-primary"
        }, {
          default: _withCtx(() => [
            (_openBlock(), _createBlock(_component_t, { key: $options.submit }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString($options.submit), 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            }))
          ]),
          _: 1 /* STABLE */
        }))
      : _createCommentVNode("v-if", true),
    (_ctx.$props['for'] !== 'view' && !$props.toast && !$props.excludeButtons.includes('reset'))
      ? (_openBlock(), _createBlock(_component_b_button, {
          key: 1,
          type: "reset",
          variant: "outline-danger"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_t, null, {
              default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
                _createTextVNode("app.reset", -1 /* CACHED */)
              ]))]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }))
      : _createCommentVNode("v-if", true),
    (!$props.toast && !$props.excludeButtons.includes('cancel'))
      ? (_openBlock(), _createBlock(_component_b_button, {
          key: 2,
          type: "button",
          onClick: $options.onCancel,
          variant: "outline-secondary"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_t, null, {
              default: _withCtx(() => [...(_cache[1] || (_cache[1] = [
                _createTextVNode("app.cancel", -1 /* CACHED */)
              ]))]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["onClick"]))
      : _createCommentVNode("v-if", true),
    _renderSlot(_ctx.$slots, "after-submit")
  ]))
}
_sfc_main.render = render;
