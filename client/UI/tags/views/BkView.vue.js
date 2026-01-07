
  import { Class } from "meteor/akyma:astronomy"
  import BkViewInner from "./BkViewInner.vue.js";
  const _sfc_main = {
    name: "BkView",
    components: {BkViewInner},
    props: {
      model: Class,
      field: String,
      noDiv: Boolean,
      noFormGroup: Boolean,
      noLabel: Boolean,
      noHtml: Boolean,
      format: String,
      locale: String,
      fileFormat: String,
    },
  }


export default _sfc_main;

import { resolveComponent as _resolveComponent, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, openBlock as _openBlock, createBlock as _createBlock, mergeProps as _mergeProps, createCommentVNode as _createCommentVNode, createVNode as _createVNode, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  key: 1,
  class: "row"
}
const _hoisted_2 = {
  key: 2,
  class: "form-group is-focused row"
}

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bk_view_inner = _resolveComponent("bk-view-inner")

  return ($props.noDiv)
    ? (_openBlock(), _createBlock(_component_bk_view_inner, _normalizeProps(_mergeProps({ key: 0 }, _ctx.$props)), null, 16 /* FULL_PROPS */))
    : ($props.noFormGroup)
      ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
          _createVNode(_component_bk_view_inner, _normalizeProps(_guardReactiveProps(_ctx.$props)), null, 16 /* FULL_PROPS */)
        ]))
      : (_openBlock(), _createElementBlock("div", _hoisted_2, [
          _createVNode(_component_bk_view_inner, _normalizeProps(_guardReactiveProps(_ctx.$props)), null, 16 /* FULL_PROPS */)
        ]))
}
_sfc_main.render = render;
