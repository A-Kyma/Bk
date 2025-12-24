
import {Class} from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n";
import {_} from "lodash";

const _sfc_main = {
  name: "BkDropdown",
  props: {
    model: Class,
    field: String,
    options: Array,
  },
  computed: {
    dropdownText() {
      let value = this.model[this.field];
      if (value) {
        let translatedElem = this.options.find(elem => elem.value === value);
        if (translatedElem) { return translatedElem.text };
      }
      return "Choose";
    }
  },
  methods: {
    onClick(e) {
      let elem = this.options.find(x => x.text === e.target.innerText)
      this.model[this.field] = elem.value;
    }
  },
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_b_dropdown_item = _resolveComponent("b-dropdown-item")
  const _component_b_dropdown = _resolveComponent("b-dropdown")

  return (_openBlock(), _createBlock(_component_b_dropdown, { text: _ctx.dropdownText }, {
    default: _withCtx(() => [
      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
        return (_openBlock(), _createBlock(_component_b_dropdown_item, {
          "data-value": item.value,
          onClick: _ctx.onClick
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(item.text), 1 /* TEXT */)
          ]),
          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["data-value", "onClick"]))
      }), 256 /* UNKEYED_FRAGMENT */))
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["text"]))
}
_sfc_main.render = render;
