
import { Class } from "meteor/akyma:astronomy"

const _sfc_main = {
    name: "BkFieldList",
    props: {
      model: Class,
      fields: [Array,String],
      exclude: [Array,String],
      noEdit: [String,Array],
    },
    inject: ["formModel"],
    computed: {
      inputModel() {
        return this.model || this.formModel;
      },
      fieldsArray() {
        let fields = this.fields;
        let exclude = this.exclude;
        return this.inputModel.constructor.getFieldsNamesByFilter({fields,exclude});
      }
    },
  methods: {
    excludeComputed(field) {
      let result=[]
      let exclude=[];
      if (this.exclude) {
        if (typeof (this.exclude) === "string") {
          exclude = this.exclude.replace(RegExp(" ", "g"), "").split(",");
        }
        if (Array.isArray(this.exclude)) {
          exclude = this.exclude;
        }
      }
      exclude.forEach(f => {
        if (!f)
          return result;
        let decomposition = f.split(".")
        if (decomposition[0] === field && decomposition.length > 1)
          decomposition.splice(0,1)
        let subfield = decomposition.join(".")
        result.push(subfield)
      })
      return result;
    }
  },
  }


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, mergeProps as _mergeProps, renderSlot as _renderSlot, resolveComponent as _resolveComponent, withCtx as _withCtx, createSlots as _createSlots, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bk_input = _resolveComponent("bk-input")

  return (_openBlock(), _createElementBlock("div", null, [
    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.fieldsArray, (field) => {
      return (_openBlock(), _createBlock(_component_bk_input, _mergeProps({ ref_for: true }, _ctx.$attrs, {
        model: $options.inputModel,
        field: field,
        exclude: $options.excludeComputed(field),
        onInput: $event => (_ctx.$emit('change',{field: field,value: $options.inputModel[field]})),
        onSelect: $event => (_ctx.$emit('select',field,$event)),
        onTag: _cache[0] || (_cache[0] = $event => (_ctx.$emit('tag',$event)))
      }), _createSlots({ _: 2 /* DYNAMIC */ }, [
        _renderList(_ctx.$scopedSlots, (_, slot) => {
          return {
            name: slot,
            fn: _withCtx((props) => [
              _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
            ])
          }
        })
      ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "field", "exclude", "onInput", "onSelect"]))
    }), 256 /* UNKEYED_FRAGMENT */))
  ]))
}
_sfc_main.render = render;
