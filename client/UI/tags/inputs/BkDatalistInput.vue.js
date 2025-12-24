
import {Class} from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n";
import {_} from "lodash";

const _sfc_main = {
  name: "BkDatalistInput",
  props: {
    model: Class,
  },
  data() {
    return {
      value: this.model.defaultName(),
      options: []
    }
  },
  computed: {
    /*
    options() {
      // Todo : return available values using Method
      return this.model.searchCity(this.value, I18n.getLanguage())
    },
    */

    inputValue: {
      set(value) {
        let self = this;
        this.fillOptions(value)
        this.value = value;
      },
      get() {
        return this.value;
      }
    },
    datalistId() {
      return "datalist_" + this.model._id;
    }
  }
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, mergeProps as _mergeProps, createVNode as _createVNode, createCommentVNode as _createCommentVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_b_form_input = _resolveComponent("b-form-input")
  const _component_b_form_datalist = _resolveComponent("b-form-datalist")

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_b_form_input, _mergeProps(_ctx.$attrs, {
      modelValue: _ctx.inputValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.inputValue) = $event)),
      state: _ctx.state,
      list: _ctx.datalistId
    }), null, 16 /* FULL_PROPS */, ["modelValue", "state", "list"]),
    _createCommentVNode(" TODO use collapse + selectable table instead "),
    _createVNode(_component_b_form_datalist, {
      id: _ctx.datalistId,
      options: _ctx.options
    }, null, 8 /* PROPS */, ["id", "options"])
  ]))
}
_sfc_main.render = render;
