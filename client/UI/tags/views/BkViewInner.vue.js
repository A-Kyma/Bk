
  import {Class} from "meteor/akyma:astronomy"
  import BkLabel from "../forms/BkLabel.vue.js";
  import BkViewClean from "./BkViewClean.vue.js";

  const _sfc_main = {
    name: "BkViewInner",
    components: {BkLabel,BkViewClean},
    props: {
      model: Class,
      field: String,
      noLabel: Boolean,
      format: String,
      locale: String,
      fileFormat: String,
    },
    computed: {
      url() {
        return this.model.getDefinition(this.field,"url");
      }
    },
  }


export default _sfc_main;

import { createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, openBlock as _openBlock, createBlock as _createBlock, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, createVNode as _createVNode, createElementBlock as _createElementBlock, mergeProps as _mergeProps, createElementVNode as _createElementVNode, Fragment as _Fragment } from "vue"

const _hoisted_1 = ["href"]

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bk_label = _resolveComponent("bk-label")
  const _component_bk_view_clean = _resolveComponent("bk-view-clean")

  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createCommentVNode(" one root element only ! "),
    _createElementVNode("span", null, [
      (!$props.noLabel)
        ? (_openBlock(), _createBlock(_component_bk_label, {
            key: 0,
            for: "view",
            model: $props.model,
            field: $props.field,
            locale: $props.locale
          }, null, 8 /* PROPS */, ["model", "field", "locale"]))
        : _createCommentVNode("v-if", true),
      ($options.url !== undefined)
        ? (_openBlock(), _createElementBlock("a", {
            key: 1,
            href: $options.url
          }, [
            _createVNode(_component_bk_view_clean, _normalizeProps(_guardReactiveProps({..._ctx.$props,..._ctx.$attrs})), null, 16 /* FULL_PROPS */)
          ], 8 /* PROPS */, _hoisted_1))
        : (_openBlock(), _createBlock(_component_bk_view_clean, _normalizeProps(_mergeProps({ key: 2 }, {..._ctx.$props,..._ctx.$attrs})), null, 16 /* FULL_PROPS */))
    ])
  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
}
_sfc_main.render = render;
