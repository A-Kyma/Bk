
  import { Class } from "meteor/akyma:astronomy";
  import { QIcon } from "quasar";
  //import BkTranslate from "../translation/BkTranslate.vue.js";
 
  const _sfc_main = {
    name: "BkLabel",
    components: {
      QIcon
      //,t: BkTranslate
    },
    props: {
      model: Class,
      field: String,
      for: String,
      noLabel: Boolean,
      noRequired: Boolean,
      locale: String
    },
    //inject: ["formModel"],
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

import { createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_QIcon = _resolveComponent("QIcon")

  return (_openBlock(), _createElementBlock("label", {
    class: _normalizeClass($options.computedClass)
  }, [
    _createCommentVNode("<t :options=\"context\" :locale=\"fr\">{{label}}</t>"),
    _createVNode(_component_QIcon, { name: "fas fa-check" })
  ], 2 /* CLASS */))
}
_sfc_main.render = render;
