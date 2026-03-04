
import {Class,ListField} from "meteor/akyma:astronomy"
import Lifecycle from "../../../../lib/modules/customFields/customs/Lifecycle";
import Enum from "../../../../lib/modules/customFields/customs/Enum";

const _sfc_main = {
  name: "BkViewClean",
  props: {
    model: {
      type: Class,
      required: true
    },
    field: String,
    format: String,
    locale: String,
    options: {
      type: [Object, Array],
      default() { return {}}
    },
    fileFormat: {
      type: String,
      default: "normal"
    }
  },
  computed: {
    classDefinition() {
      return this.model.getFieldClass(this.field);
    },
    classDefinitionName() {
      let definition = this.model.getDefinition(this.field)
      let fieldClass = this.classDefinition
      if (Enum.includes(fieldClass) && definition instanceof ListField) return "ListEnum"
      if (Enum.includes(fieldClass)) return "Enum"
      if (Lifecycle.includes(fieldClass)) return "Lifecycle"
      return definition.type.name
    },
  },

  meteor: {
    value() {
      return this.model.getValue(this.field, this.format);
    }
  },

  methods: {
    staticLink(format) {
      let fileId = this.value
      if (!format) format="original"
      if (fileId === undefined && this.default) return this.default
      if (fileId === undefined) return
      return Meteor.absoluteUrl("/cdn/storage/Files/" + fileId + "/" + format + "/" + fileId + ".jpg")
    },
  },
}


export default _sfc_main;

import { normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, renderList as _renderList, Fragment as _Fragment, createElementBlock as _createElementBlock, mergeProps as _mergeProps, createSlots as _createSlots, createVNode as _createVNode } from "vue"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { key: 0 }
const _hoisted_3 = ["innerHTML"]
const _hoisted_4 = { key: 9 }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_b_form_checkbox = _resolveComponent("b-form-checkbox")
  const _component_b_avatar = _resolveComponent("b-avatar")
  const _component_b_form_rating = _resolveComponent("b-form-rating")
  const _component_b_progress_bar = _resolveComponent("b-progress-bar")
  const _component_b_progress = _resolveComponent("b-progress")

  return (_openBlock(), _createElementBlock("span", null, [
    _renderSlot(_ctx.$slots, "lifecycle", _normalizeProps(_guardReactiveProps({classDefinition: $options.classDefinition, model: $props.model,field: $props.field, value: _ctx.value})), () => [
      ($options.classDefinitionName === 'Lifecycle')
        ? (_openBlock(), _createBlock(_component_b_button, {
            key: 0,
            name: "lifecycle",
            variant: $options.classDefinition.getStateVariant($props.model[$props.field]),
            pill: "",
            disabled: ""
          }, {
            default: _withCtx(() => [
              (_openBlock(), _createBlock(_component_t, {
                key: _ctx.value,
                locale: $props.locale,
                options: $props.options
              }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_ctx.value), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["locale", "options"]))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["variant"]))
        : ($options.classDefinitionName === 'ListEnum')
          ? (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(_ctx.value, (text, index) => {
              return (_openBlock(), _createElementBlock("span", null, [
                (index !== 0)
                  ? (_openBlock(), _createElementBlock("span", _hoisted_1, ", "))
                  : _createCommentVNode("v-if", true),
                (_openBlock(), _createBlock(_component_t, {
                  key: text,
                  locale: $props.locale
                }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(text), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["locale"]))
              ]))
            }), 256 /* UNKEYED_FRAGMENT */))
          : ($options.classDefinitionName === 'Enum')
            ? (_openBlock(), _createBlock(_component_t, {
                key: _ctx.value,
                locale: $props.locale,
                options: $props.options
              }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_ctx.value), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["locale", "options"]))
            : ($options.classDefinitionName === 'Color')
              ? (_openBlock(), _createBlock(_component_b_icon, {
                  key: 3,
                  icon: "circle-fill",
                  color: _ctx.value
                }, null, 8 /* PROPS */, ["color"]))
              : ($options.classDefinitionName === 'Boolean')
                ? (_openBlock(), _createBlock(_component_b_form_checkbox, {
                    key: 4,
                    modelValue: _ctx.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.value) = $event)),
                    disabled: ""
                  }, null, 8 /* PROPS */, ["modelValue"]))
                : ($options.classDefinitionName === 'Avatar')
                  ? (_openBlock(), _createBlock(_component_b_avatar, _mergeProps({ key: 5 }, _ctx.$attrs, {
                      src: $options.staticLink($props.fileFormat),
                      key: _ctx.value
                    }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                      _renderList(_ctx.$scopedSlots, (_, slot) => {
                        return {
                          name: slot,
                          fn: _withCtx((props) => [
                            _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                          ])
                        }
                      })
                    ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["src"]))
                  : ($options.classDefinitionName === 'Rating')
                    ? (_openBlock(), _createBlock(_component_b_form_rating, _mergeProps({
                        key: 6,
                        modelValue: _ctx.value,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.value) = $event)),
                        readonly: ""
                      }, _ctx.$attrs), null, 16 /* FULL_PROPS */, ["modelValue"]))
                    : ($options.classDefinitionName === 'Percentage')
                      ? (_openBlock(), _createBlock(_component_b_progress, {
                          key: 7,
                          max: "100",
                          "show-progress": "",
                          animated: ""
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_b_progress_bar, { value: _ctx.value }, {
                              default: _withCtx(() => [
                                (_ctx.value)
                                  ? (_openBlock(), _createElementBlock("span", _hoisted_2, _toDisplayString(_ctx.value) + "%", 1 /* TEXT */))
                                  : _createCommentVNode("v-if", true)
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["value"])
                          ]),
                          _: 1 /* STABLE */
                        }))
                      : ($options.classDefinitionName==='TextEditor')
                        ? (_openBlock(), _createElementBlock("span", {
                            key: 8,
                            innerHTML: _ctx.value
                          }, null, 8 /* PROPS */, _hoisted_3))
                        : (_openBlock(), _createElementBlock("span", _hoisted_4, _toDisplayString(_ctx.value), 1 /* TEXT */))
    ])
  ]))
}
_sfc_main.render = render;
