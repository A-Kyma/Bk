
  import {Class} from 'meteor/akyma:astronomy';
  import _ from "lodash";
  import BkLabel from "../forms/BkLabel.vue.js";
  import { I18n } from "meteor/akyma:bk"

  const _sfc_main = {
    name: "BkInput",
    components: {BkLabel},
    props: {
      model: {
        type: Class,
        required: true
      },
      field: {
        type: String,
        required: true
      },
      for: String,
      formField: String,
      formGenericField: String,
      noLabel: Boolean,
    },
    // Pay attention that injected objects are not reactive
    inject: ["formModel"],
    data() {
      return {
        invalidFeedback: null,
        state: null,
      }
    },

    /* Use of meteor instead of computed here implies version 2+ of vue-meteor-tracker */
    computed: {
      // model from props or injection
      inputModel() {
        return this.model || this.formModel;
      },
      // Used for slots, we do not have index for arrays, so all fields in array are replaced
      formGenericFieldComputed() {
        if (this.formGenericField) return this.formGenericField + "." + this.field;
        return this.formFieldComputed;
      },
      formFieldComputed() {
        return this.formField && this.formField + "." + this.field || this.field;
      },
      // If for view or if readonly field, return true
      plaintext() {
        if (this.$props.for === "view") {
          return true;
        }
        if (!this.inputModel.canEdit(this.field)) {
          return true;
        }
        return this.$props.plaintext;
      },
      canView() {
        return this.inputModel.canView(this.field,undefined,this.formModel);
      },
      placeholder() {
        return "Enter " + this.field
      },
      validFeedback() {
        return ""
      },
      ui() {
        if (this.noUI) {return {}};
        return this.definition.ui || {};
      },
      definition() {
        return this.model.getDefinition(this.field) || {};
      },
      // If accordion, only one open
      // if not, all will be opened at start
      accordionId() {
        return "Collapse_" + this.field + "_" + this._uid;
      },
      accordionGroupId() {
        if (this.ui.accordion || this.ui.basic) {
          return this.model.constructor.getName();
        } else {
          return this.model.constructor.getName()+'_' + this._uid;
        }
      }
    },
    meteor: {
      description() {
        if (this.plaintext) return
        if (this.model.constructor.parentClassName === "ParameterTableElement")
          return this.model.constructor.getDescription(this.field)

        return I18n.t(this.model.constructor.getDescriptionKey(this.field),{ignoreNotFound: true})
      },
    },
    methods: {
      onState(state) {
        this.state = state;
      },
      onError(error) {
        this.invalidFeedback = error;
      },
      toggleAccordion() {
        this.$root.$emit('bv::toggle::collapse', this.accordionId)
      },
    }
  }


export default _sfc_main;

import { normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, resolveComponent as _resolveComponent, mergeProps as _mergeProps, createVNode as _createVNode, withCtx as _withCtx, renderList as _renderList, createSlots as _createSlots, createElementVNode as _createElementVNode, normalizeClass as _normalizeClass, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createElementBlock as _createElementBlock, Transition as _Transition } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = ["innerHTML"]
const _hoisted_2 = { key: 1 }
const _hoisted_3 = ["id"]
const _hoisted_4 = ["innerHTML"]
const _hoisted_5 = ["innerHTML"]

function render(_ctx, _cache) {
  const _component_bk_label = _resolveComponent("bk-label")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_card_header = _resolveComponent("b-card-header")
  const _component_bk_inner_input = _resolveComponent("bk-inner-input")
  const _component_b_form_invalid_feedback = _resolveComponent("b-form-invalid-feedback")
  const _component_b_card_body = _resolveComponent("b-card-body")
  const _component_b_collapse = _resolveComponent("b-collapse")
  const _component_b_card = _resolveComponent("b-card")
  const _component_b_form_group = _resolveComponent("b-form-group")

  return (_openBlock(), _createBlock(_Transition, {
    name: "slide-fade",
    appear: ""
  }, {
    default: _withCtx(() => [
      _renderSlot(_ctx.$slots, _ctx.formGenericFieldComputed + '-form-group', _normalizeProps(_guardReactiveProps(_ctx.$props)), () => [
        (_ctx.ui.collapsible || _ctx.ui.accordion)
          ? (_openBlock(), _createBlock(_component_b_card, {
              key: 0,
              "no-body": "",
              class: _normalizeClass('mb-1 ' + this.model.constructor.getName()),
              id: _ctx.field
            }, {
              default: _withCtx(() => [
                _createVNode(_component_b_card_header, {
                  "header-tag": "header",
                  class: "p-1",
                  role: "tab"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_button, _mergeProps({
                      block: "",
                      onClick: _ctx.toggleAccordion
                    }, _ctx.$attrs), {
                      default: _withCtx(() => [
                        _renderSlot(_ctx.$slots, _ctx.formFieldComputed + '-label', _normalizeProps(_guardReactiveProps(_ctx.$props)), () => [
                          _createVNode(_component_bk_label, _mergeProps(_ctx.$props, { noRequired: "" }), null, 16 /* FULL_PROPS */)
                        ])
                      ]),
                      _: 3 /* FORWARDED */
                    }, 16 /* FULL_PROPS */, ["onClick"])
                  ]),
                  _: 3 /* FORWARDED */
                }),
                _createVNode(_component_b_collapse, {
                  id: _ctx.accordionId,
                  visible: "",
                  accordion: _ctx.accordionGroupId,
                  role: "tabpanel"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_card_body, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_bk_inner_input, _mergeProps({..._ctx.$parent.$attrs,..._ctx.$props, ..._ctx.$attrs}, {
                          onState: _ctx.onState,
                          onValidationError: _ctx.onError,
                          model: _ctx.inputModel,
                          onInput: _cache[0] || (_cache[0] = $event => (_ctx.$emit('input'))),
                          onChange: _cache[1] || (_cache[1] = $event => (_ctx.$emit('change'))),
                          onSelect: _cache[2] || (_cache[2] = $event => (_ctx.$emit('select',$event))),
                          onTag: _cache[3] || (_cache[3] = $event => (_ctx.$emit('tag',$event)))
                        }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                          _renderList(_ctx.$scopedSlots, (_, slot) => {
                            return {
                              name: slot,
                              fn: _withCtx((props) => [
                                _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                              ])
                            }
                          })
                        ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["onState", "onValidationError", "model"]),
                        _createVNode(_component_b_form_invalid_feedback, { state: _ctx.state }, {
                          default: _withCtx(() => [
                            _createElementVNode("span", { innerHTML: _ctx.invalidFeedback }, null, 8 /* PROPS */, _hoisted_1)
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["state"])
                      ]),
                      _: 3 /* FORWARDED */
                    })
                  ]),
                  _: 3 /* FORWARDED */
                }, 8 /* PROPS */, ["id", "accordion"])
              ]),
              _: 3 /* FORWARDED */
            }, 8 /* PROPS */, ["class", "id"]))
          : (_ctx.ui.basic)
            ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
                _createElementVNode("div", {
                  class: _normalizeClass(["col-lg-12 basic-group", _ctx.accordionGroupId]),
                  id: _ctx.field
                }, [
                  _renderSlot(_ctx.$slots, _ctx.formFieldComputed + '-label', _normalizeProps(_guardReactiveProps(_ctx.$props)), () => [
                    _createVNode(_component_bk_label, _mergeProps(_ctx.$props, { noRequired: "" }), null, 16 /* FULL_PROPS */)
                  ])
                ], 10 /* CLASS, PROPS */, _hoisted_3),
                _createVNode(_component_bk_inner_input, _mergeProps({..._ctx.$parent.$attrs,..._ctx.$props, ..._ctx.$attrs}, {
                  onState: _ctx.onState,
                  onValidationError: _ctx.onError,
                  onInput: _cache[4] || (_cache[4] = $event => (_ctx.$emit('input'))),
                  onChange: _cache[5] || (_cache[5] = $event => (_ctx.$emit('change'))),
                  onSelect: _cache[6] || (_cache[6] = $event => (_ctx.$emit('select',$event))),
                  onTag: _cache[7] || (_cache[7] = $event => (_ctx.$emit('tag',$event))),
                  model: _ctx.inputModel
                }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                  _renderList(_ctx.$scopedSlots, (_, slot) => {
                    return {
                      name: slot,
                      fn: _withCtx((props) => [
                        _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                      ])
                    }
                  })
                ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["onState", "onValidationError", "model"]),
                _createVNode(_component_b_form_invalid_feedback, { state: _ctx.state }, {
                  default: _withCtx(() => [
                    _createElementVNode("span", { innerHTML: _ctx.invalidFeedback }, null, 8 /* PROPS */, _hoisted_4)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["state"])
              ]))
            : (_ctx.canView)
              ? (_openBlock(), _createBlock(_component_b_form_group, _mergeProps({ key: 2 }, {..._ctx.$parent.$attrs,..._ctx.$attrs}, {
                  "valid-feedback": _ctx.validFeedback,
                  "label-class": _ctx.ui.labelClass,
                  "label-size": _ctx.ui.labelSize,
                  description: _ctx.description
                }), {
                  label: _withCtx(() => [
                    _renderSlot(_ctx.$slots, _ctx.formGenericFieldComputed + '-label', _normalizeProps(_guardReactiveProps(_ctx.$props)), () => [
                      _createVNode(_component_bk_label, _normalizeProps(_guardReactiveProps({..._ctx.$props,..._ctx.$attrs})), null, 16 /* FULL_PROPS */)
                    ])
                  ]),
                  default: _withCtx(() => [
                    _createVNode(_component_bk_inner_input, _mergeProps({..._ctx.$parent.$attrs,..._ctx.$props, ..._ctx.$attrs}, {
                      onState: _ctx.onState,
                      onValidationError: _ctx.onError,
                      onInput: _cache[8] || (_cache[8] = $event => (_ctx.$emit('input'))),
                      onSelect: _cache[9] || (_cache[9] = $event => (_ctx.$emit('select',$event))),
                      onTag: _cache[10] || (_cache[10] = $event => (_ctx.$emit('tag',$event))),
                      model: _ctx.inputModel
                    }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                      _renderList(_ctx.$scopedSlots, (_, slot) => {
                        return {
                          name: slot,
                          fn: _withCtx((props) => [
                            _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                          ])
                        }
                      })
                    ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["onState", "onValidationError", "model"]),
                    _createVNode(_component_b_form_invalid_feedback, { state: _ctx.state }, {
                      default: _withCtx(() => [
                        _createElementVNode("span", { innerHTML: _ctx.invalidFeedback }, null, 8 /* PROPS */, _hoisted_5)
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["state"])
                  ]),
                  _: 3 /* FORWARDED */
                }, 16 /* FULL_PROPS */, ["valid-feedback", "label-class", "label-size", "description"]))
              : _createCommentVNode("v-if", true)
      ])
    ]),
    _: 3 /* FORWARDED */
  }))
}
_sfc_main.render = render;
