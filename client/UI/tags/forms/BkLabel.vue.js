
  import { Class } from "meteor/akyma:astronomy";

  const _sfc_main = {
    name: "BkLabel",
    props: {
      model: Class,
      field: String,
      for: String,
      noLabel: Boolean,
      noRequired: Boolean,
      locale: String
    },
    inject: ["formModel"],
    computed: {
      computedClass() {
        if (this.noLabel) return "sr-only"
        return this.ui.labelClass
      },
      label() {
        return this.model.constructor.getLabelKey(this.field)
      },
      context(){
        let value = {}
        let labelContext = this.$attrs["label-context"]
        if (labelContext === undefined) return
        if(labelContext.name && labelContext.value){
          value[labelContext.name] = labelContext.value
          return value
        }
        return
      },
      definition() {
        return this.model.getDefinition(this.field);
      },
      ui() {
        return this.definition?.ui || {};
      },
      required() {
        if (this.noRequired) return false;
        if (this.$props.for === "view") return false;
        let optional
        if (typeof this.definition.optional === "function")
          optional = this.definition.optional(this.model, this.formModel)
        else
          optional = this.definition.optional
        return !optional;
      },
    },
  }


export default _sfc_main;

import { toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_b_icon_asterisk = _resolveComponent("b-icon-asterisk")

  return (_openBlock(), _createElementBlock("label", {
    class: _normalizeClass($options.computedClass)
  }, [
    _createVNode(_component_t, {
      options: $options.context,
      locale: $props.locale
    }, {
      default: _withCtx(() => [
        _createTextVNode(_toDisplayString($options.label), 1 /* TEXT */)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["options", "locale"]),
    ($options.required)
      ? (_openBlock(), _createBlock(_component_b_icon_asterisk, {
          key: 0,
          variant: "danger",
          "font-scale": "0.5",
          "shift-v": "10"
        }))
      : _createCommentVNode("v-if", true)
  ], 2 /* CLASS */))
}
_sfc_main.render = render;
