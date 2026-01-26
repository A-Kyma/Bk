
import {Class} from "meteor/akyma:astronomy"
import Multiselect from 'vue-multiselect'
import I18n from "../../../../lib/classes/i18n";
import relationSubscriptionMixin from "../../../utils/relationSubscriptionMixin";
// import 'vue-multiselect/dist/vue-multiselect.min.css'

const _sfc_main = {
  name: "BkBelongsToMany",
  components: {Multiselect},
  mixins: [relationSubscriptionMixin],
  props: {
    taggable: {
      type: Boolean,
      default: true,
    },
    maxTags: {
        type: Number,
    },
    searchable: {
      type: Boolean,
      default: undefined
    },
    limit: Number,
    formField: String,
  },
  data() {
    return {
      searchableData: undefined,
      disabledData: this.disabled
    }
  },
  computed: {
    searchableComputed() {
      if (!this.selectInput) return true // if it's an autocomplete tag
      if (this.searchable !== undefined) return this.searchable // forced by upper tag
      if (this.definition.searchable !== undefined) return this.definition.searchable // forced by definition
      return true
    },
    formFieldComputed() {
      return this.formField || this.field;
    },
    classSingleOrTag() {
      if (!this.isArray) return "bk-multiselect--single"
      return "bk-multiselect--tag"
    }
  },
  meteor: {
    tagPlaceholder() {
      if (this.definition.searchable)
        return I18n.get("app.clickAdd")
      return I18n.get("app.notFound")
    },
    placeholder() {
      if (this.searchableData || !this.selectInput)
        return I18n.get("app.search")
      else
        return I18n.get("app.select")
    }
  },
  methods: {

  },
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createBlock as _createBlock, mergeProps as _mergeProps, createCommentVNode as _createCommentVNode, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, createVNode as _createVNode, createElementVNode as _createElementVNode, withModifiers as _withModifiers, normalizeClass as _normalizeClass } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { slot: "noOptions" }
const _hoisted_2 = { slot: "limit" }
const _hoisted_3 = {
  key: 1,
  slot: "caret"
}
const _hoisted_4 = {
  key: 2,
  slot: "singleLabel",
  class: "d-none"
}
const _hoisted_5 = {
  key: 2,
  class: "form-control-plaintext"
}

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_b_form_radio = _resolveComponent("b-form-radio")
  const _component_b_form_radio_group = _resolveComponent("b-form-radio-group")
  const _component_t = _resolveComponent("t")
  const _component_multiselect = _resolveComponent("multiselect")
  const _component_b_icon_search = _resolveComponent("b-icon-search")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_input_group_append = _resolveComponent("b-input-group-append")

  return (!_ctx.plaintext && _ctx.$props['for'] !== 'view' && _ctx.ui.template === 'BFormRadioGroup')
    ? (_openBlock(), _createBlock(_component_b_form_radio_group, _mergeProps({ key: 0 }, {..._ctx.$props,..._ctx.$attrs,..._ctx.uiComponentProps}, {
        modelValue: _ctx.model[_ctx.field],
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.model[_ctx.field]) = $event)),
        name: $options.formFieldComputed,
        disabled: _ctx.plaintext,
        class: "form-control-plaintext",
        onChange: _cache[1] || (_cache[1] = $event => (_ctx.onSelectRow({value: $event})))
      }), {
        default: _withCtx(() => [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.options || _ctx.relationList, (item) => {
            return (_openBlock(), _createBlock(_component_b_form_radio, {
              value: item.value,
              key: item.value
            }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(item.text), 1 /* TEXT */)
              ]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      }, 16 /* FULL_PROPS */, ["modelValue", "name", "disabled"]))
    : (!_ctx.plaintext && _ctx.$props['for'] !== 'view')
      ? (_openBlock(), _createElementBlock("div", {
          key: 1,
          class: _normalizeClass('input-group ' + $options.classSingleOrTag)
        }, [
          _createVNode(_component_multiselect, _mergeProps({
            ref: "select",
            class: "form-control p-0"
          }, _ctx.$attrs, {
            modelValue: _ctx.inputRelation,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.inputRelation) = $event)),
            options: _ctx.options || _ctx.relationList,
            label: "text",
            "track-by": "value",
            "show-labels": false,
            disabled: $data.disabledData,
            placeholder: _ctx.placeholder,
            tagPlaceholder: _ctx.tagPlaceholder,
            loading: !_ctx.ready,
            taggable: $props.taggable,
            "close-on-select": !_ctx.isArray,
            "clear-on-select": !_ctx.isArray,
            limit: $props.limit,
            multiple: _ctx.isArray,
            searchable: $data.searchableData,
            max: $props.maxTags,
            onSearchChange: _ctx.search,
            onSelect: _ctx.onSelectRow,
            onTag: _cache[5] || (_cache[5] = $event => (_ctx.$emit('tag',{model: _ctx.model,field: _ctx.field,value: $event}))),
            onRemove: _ctx.onRemoveTag,
            onOpen: _ctx.onOpenDropdown,
            onClose: _ctx.onCloseDropdown,
            onBlur: _withModifiers($event => (false), ["prevent"])
          }), {
            option: _withCtx((data) => [
              _renderSlot(_ctx.$slots, $options.formFieldComputed + '-option', _normalizeProps(_guardReactiveProps(data)))
            ]),
            tag: _withCtx((data) => [
              _renderSlot(_ctx.$slots, $options.formFieldComputed + '-tag', _normalizeProps(_guardReactiveProps(data)))
            ]),
            singleLabel: _withCtx((data) => [
              _renderSlot(_ctx.$slots, $options.formFieldComputed + '-single', _normalizeProps(_guardReactiveProps(data)))
            ]),
            maxElements: _withCtx(() => [
              _createVNode(_component_t, {
                options: {'count': $props.maxTags}
              }, {
                default: _withCtx(() => [...(_cache[6] || (_cache[6] = [
                  _createTextVNode("app.maxTags", -1 /* CACHED */)
                ]))]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["options"])
            ]),
            noResult: _withCtx(() => [
              _createElementVNode("span", null, [
                _renderSlot(_ctx.$slots, $options.formFieldComputed + '-noResult', {}, () => [
                  _createVNode(_component_t, null, {
                    default: _withCtx(() => [...(_cache[7] || (_cache[7] = [
                      _createTextVNode("app.notFound", -1 /* CACHED */)
                    ]))]),
                    _: 1 /* STABLE */
                  })
                ])
              ])
            ]),
            default: _withCtx(() => [
              _createElementVNode("span", _hoisted_1, [
                _createVNode(_component_t, null, {
                  default: _withCtx(() => [...(_cache[8] || (_cache[8] = [
                    _createTextVNode("app.noData", -1 /* CACHED */)
                  ]))]),
                  _: 1 /* STABLE */
                })
              ]),
              _createElementVNode("strong", _hoisted_2, [
                (_ctx.isArray)
                  ? (_openBlock(), _createBlock(_component_t, {
                      key: 0,
                      options: {'count': _ctx.getId.length}
                    }, {
                      default: _withCtx(() => [...(_cache[9] || (_cache[9] = [
                        _createTextVNode("app.selected", -1 /* CACHED */)
                      ]))]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["options"]))
                  : (_openBlock(), _createBlock(_component_t, {
                      key: 1,
                      options: {'count': _ctx.getId? 1:0}
                    }, {
                      default: _withCtx(() => [...(_cache[10] || (_cache[10] = [
                        _createTextVNode("app.selected", -1 /* CACHED */)
                      ]))]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["options"])),
                ($props.limit===0)
                  ? (_openBlock(), _createElementBlock("i", {
                      key: 2,
                      slot: "clear",
                      class: "multiselect__clear",
                      onMousedown: _cache[2] || (_cache[2] = _withModifiers((...args) => (_ctx.onRemoveAllTags && _ctx.onRemoveAllTags(...args)), ["prevent"]))
                    }, null, 32 /* NEED_HYDRATION */))
                  : _createCommentVNode("v-if", true)
              ]),
              ($props.taggable && !$data.disabledData)
                ? (_openBlock(), _createElementBlock("i", {
                    key: 0,
                    slot: "clear",
                    class: "multiselect__clear",
                    onMousedown: _cache[3] || (_cache[3] = _withModifiers((...args) => (_ctx.onRemoveAllTags && _ctx.onRemoveAllTags(...args)), ["prevent"]))
                  }, null, 32 /* NEED_HYDRATION */))
                : _createCommentVNode("v-if", true),
              ($data.disabledData)
                ? (_openBlock(), _createElementBlock("span", _hoisted_3))
                : _createCommentVNode("v-if", true),
              (_ctx.isArray)
                ? (_openBlock(), _createElementBlock("span", _hoisted_4))
                : _createCommentVNode("v-if", true)
            ]),
            _: 3 /* FORWARDED */
          }, 16 /* FULL_PROPS */, ["modelValue", "options", "disabled", "placeholder", "tagPlaceholder", "loading", "taggable", "close-on-select", "clear-on-select", "limit", "multiple", "searchable", "max", "onSearchChange", "onSelect", "onRemove", "onOpen", "onClose"]),
          _createVNode(_component_b_input_group_append, null, {
            default: _withCtx(() => [
              ($options.searchableComputed && _ctx.selectInput && !$data.disabledData)
                ? (_openBlock(), _createBlock(_component_b_button, {
                    key: 0,
                    size: "sm",
                    onClick: _withModifiers(_ctx.allowSearch, ["prevent"]),
                    variant: "dark",
                    class: "input-group-append align-items-center"
                  }, {
                    default: _withCtx(() => [
                      _createVNode(_component_b_icon_search, { class: "" })
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["onClick"]))
                : _createCommentVNode("v-if", true),
              _renderSlot(_ctx.$slots, $options.formFieldComputed + '-append', _normalizeProps(_guardReactiveProps({..._ctx.$props, ...{oldValue: _ctx.oldValue, value: _ctx.getId}})))
            ]),
            _: 3 /* FORWARDED */
          }),
          _renderSlot(_ctx.$slots, $options.formFieldComputed+'-after', _normalizeProps(_guardReactiveProps({..._ctx.$props, oldValue: _ctx.oldValue, value: _ctx.getId, options: _ctx.relationList, ready: _ctx.ready, removeId: _ctx.removeId, removeAll: _ctx.removeAll})))
        ], 2 /* CLASS */))
      : (_openBlock(), _createElementBlock("span", _hoisted_5, _toDisplayString(_ctx.viewInputRelation), 1 /* TEXT */))
}
_sfc_main.render = render;
