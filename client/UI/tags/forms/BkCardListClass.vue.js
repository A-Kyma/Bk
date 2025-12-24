
import { Class } from "meteor/akyma:astronomy"
import { Enum } from "meteor/akyma:bk"
import BkButtonIcon from "../links/BkButtonIcon.vue.js";
import BkFieldList from "./BkFieldList.vue.js";
import BkModal from "../modals/BkModal.vue.js";
import BkInput from "../inputs/BkInput.vue.js";
import BkViewClean from "../views/BkViewClean.vue.js";
import { Container, Draggable } from "vue-smooth-dnd";
import applyDrag from "../../../utils/applyDrag";

const _sfc_main = {
    name: "BkCardListClass",
    components: {BkButtonIcon,BkFieldList,BkModal,BkInput,BkViewClean,Container,Draggable},
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String
    },
  data() {
    return {
      hoverTrashIcon: false,
      modalModel: undefined,
      indexToAdd: 0,
      insertModel: {
        selected: undefined,
        number: 1,
      },
    }
  },
  computed: {
    getTypeField() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass.definition.typeField;
    },
    /* @deprecated */
    modalId() {
      return this.field + '_' + this._uid;
    },
    /* @deprecated */
    modalModelClass() {
      return this.model.getFieldClass(this.field);
    },
    canDelete() {
      if (this.$props.for === "view") return false;
      return this.model.canUpdate(this.field);
    },
    enumOptions() {
      let subclass = this.model.getFieldClass(this.field);
      if (!subclass?.definition?.typeField) return
      let fieldDefinition = subclass.getDefinition(subclass.definition.typeField);
      if (!fieldDefinition) return

      let fieldType = fieldDefinition.type.name;
      let EnumClass = fieldDefinition.type.class
      if (! Enum.enums[fieldType]) { return }
      return EnumClass.getOptions();
    },
  },
  methods: {
    onAddSubClass(index) {
      if (index === -1) index = this.model[this.field].length

      let typefield = this.getTypeField;
      for (let i=0; i<this.insertModel.number; i++) {
        let innerModel;
        if (typefield) {
          if (!this.insertModel.selected) return
          innerModel = Class.get(this.insertModel.selected);
        }
        else
          innerModel = this.model.getFieldClass(this.field);

        const newInner = new innerModel()
        newInner._getParent = () => this.model
        this.model[this.field].splice(index,0,newInner);
      }
      this.insertModel.selected = undefined
      this.insertModel.number = 1
    },
    /* @deprecated */
    onAdd(index,innerModel) {
      //add a new model of same type afterwards
      let typefield = this.getTypeField;
      if (typefield) {
        this.indexToAdd = index;
        // Ask for new model using same type field
        this.modalModel = new (this.modalModelClass)();
        this.modalModel[typefield] = innerModel[typefield];
        this.$bvModal.show(this.modalId);
      } else {
        this.modalModel = new (this.modalModelClass)();
        this.model[this.field].splice(index,0,this.modalModel)
      }
    },
    onRemove(index) {
      //remove the model
      this.model[this.field].splice(index,1);
    },
    /* @deprecated */
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    },
    /* @deprecated */
    onSubmitModal(e) {
      let modelClass = Class.get(this.modalModel.type);
      if (!modelClass) return;
      if (!this.modalModel.isValid(this.getTypeField)) {
        // if modal form content not valid, do not close it
        e.preventDefault();
        return;
      }
      this.model[this.field].splice(this.indexToAdd,0,new modelClass());
    },
    /* @deprecated */
    getIndexForModel(innerModel,index) {
      let typeField = this.getTypeField;
      // TODO: Can't to this, this filter the original Array in this.model !
      this.model[this.field].filter((x) => {
        x[typeField] = innerModel[typeField]
      })
      return index;
    },
    getGhostParent() {
      return document.body
    },
    onDrop(e) {
      applyDrag(this.model[this.field],e)
    }
  },
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createBlock as _createBlock, createCommentVNode as _createCommentVNode, mergeProps as _mergeProps, renderSlot as _renderSlot, createSlots as _createSlots } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  ref: "parent",
  class: "col-12 d-block"
}

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_b_form_select_option = _resolveComponent("b-form-select-option")
  const _component_b_form_select = _resolveComponent("b-form-select")
  const _component_b_col = _resolveComponent("b-col")
  const _component_b_form_input = _resolveComponent("b-form-input")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_row = _resolveComponent("b-row")
  const _component_bk_view_clean = _resolveComponent("bk-view-clean")
  const _component_bk_button_icon = _resolveComponent("bk-button-icon")
  const _component_bk_input = _resolveComponent("bk-input")
  const _component_b_card_header = _resolveComponent("b-card-header")
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_b_card = _resolveComponent("b-card")
  const _component_Draggable = _resolveComponent("Draggable")
  const _component_Container = _resolveComponent("Container")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (_ctx.$props['for'] !== 'view')
      ? (_openBlock(), _createBlock(_component_b_row, {
          key: 0,
          class: "mb-2"
        }, {
          default: _withCtx(() => [
            (_ctx.getTypeField)
              ? (_openBlock(), _createBlock(_component_b_col, { key: 0 }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_form_select, {
                      modelValue: _ctx.insertModel.selected,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.insertModel.selected) = $event))
                    }, {
                      default: _withCtx(() => [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.enumOptions, (option) => {
                          return (_openBlock(), _createBlock(_component_b_form_select_option, {
                            key: option.key,
                            value: option.value
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(option.key), 1 /* TEXT */)
                                ]),
                                _: 2 /* DYNAMIC */
                              }, 1024 /* DYNAMIC_SLOTS */)
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["modelValue"])
                  ]),
                  _: 1 /* STABLE */
                }))
              : _createCommentVNode("v-if", true),
            (!_ctx.$attrs.noNumber)
              ? (_openBlock(), _createBlock(_component_b_col, { key: 1 }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_form_input, {
                      type: "number",
                      modelValue: _ctx.insertModel.number,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.insertModel.number) = $event))
                    }, null, 8 /* PROPS */, ["modelValue"])
                  ]),
                  _: 1 /* STABLE */
                }))
              : _createCommentVNode("v-if", true),
            _createVNode(_component_b_col, null, {
              default: _withCtx(() => [
                _createVNode(_component_b_button, {
                  variant: "outline-secondary",
                  onClick: _cache[2] || (_cache[2] = $event => (_ctx.onAddSubClass(0)))
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [...(_cache[6] || (_cache[6] = [
                        _createTextVNode("app.add", -1 /* CACHED */)
                      ]))]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }))
      : _createCommentVNode("v-if", true),
    _createVNode(_component_Container, {
      ref: "container",
      behaviour: "move",
      "drag-class": "card-ghost bg-warning",
      "drop-class": "card-ghost-drop",
      onDrop: _ctx.onDrop,
      "get-ghost-parent": _ctx.getGhostParent
    }, {
      default: _withCtx(() => [
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.model[_ctx.field], (innerModel, index) => {
          return (_openBlock(), _createBlock(_component_Draggable, {
            key: innerModel._id.valueOf(),
            class: "overflow-visible"
          }, {
            default: _withCtx(() => [
              _createVNode(_component_b_card, {
                class: "border mb-2 drag-hover",
                "body-class": "pt-2 pl-2 pr-4 pb-0"
              }, {
                default: _withCtx(() => [
                  (_ctx.getTypeField)
                    ? (_openBlock(), _createBlock(_component_b_card_header, { key: 0 }, {
                        default: _withCtx(() => [
                          _createVNode(_component_bk_view_clean, _mergeProps({ ref_for: true }, _ctx.$attrs, {
                            model: innerModel,
                            field: _ctx.getTypeField,
                            "form-field": _ctx.formField + '.' + index,
                            "form-generic-field": _ctx.formField
                          }), null, 16 /* FULL_PROPS */, ["model", "field", "form-field", "form-generic-field"]),
                          (_ctx.canDelete)
                            ? (_openBlock(), _createBlock(_component_bk_button_icon, {
                                key: 0,
                                onClick: $event => (_ctx.onRemove(index)),
                                icon: "trash-fill",
                                variant: "danger"
                              }, null, 8 /* PROPS */, ["onClick"]))
                            : _createCommentVNode("v-if", true),
                          _createCommentVNode("{{getIndexForModel(innerModel,index)}}"),
                          (innerModel.getDefinition('isActive')!==undefined)
                            ? (_openBlock(), _createBlock(_component_bk_input, {
                                key: 1,
                                model: innerModel,
                                field: "isActive",
                                for: _ctx.$props['for'],
                                "form-field": _ctx.formField + '.' + index,
                                "form-generic-field": _ctx.formField
                              }, null, 8 /* PROPS */, ["model", "for", "form-field", "form-generic-field"]))
                            : _createCommentVNode("v-if", true)
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1024 /* DYNAMIC_SLOTS */))
                    : _createCommentVNode("v-if", true),
                  (innerModel.getDefinition('isActive')===undefined || innerModel.isActive)
                    ? (_openBlock(), _createBlock(_component_bk_field_list, _mergeProps({
                        key: 1,
                        ref_for: true
                      }, _ctx.$attrs, {
                        for: _ctx.$props['for'],
                        model: innerModel,
                        "form-field": _ctx.formField + '.' + index,
                        "form-generic-field": _ctx.formField,
                        exclude: ['isActive',_ctx.getTypeField]
                      }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                        _renderList(_ctx.$scopedSlots, (_, slot) => {
                          return {
                            name: slot,
                            fn: _withCtx((props) => [
                              _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                            ])
                          }
                        })
                      ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["for", "model", "form-field", "form-generic-field", "exclude"]))
                    : _createCommentVNode("v-if", true),
                  (!_ctx.getTypeField && _ctx.canDelete)
                    ? (_openBlock(), _createBlock(_component_bk_button_icon, {
                        key: 2,
                        onClick: $event => (_ctx.onRemove(index)),
                        icon: "trash-fill",
                        variant: "danger",
                        class: "remove-button"
                      }, null, 8 /* PROPS */, ["onClick"]))
                    : _createCommentVNode("v-if", true),
                  _createCommentVNode("\n          <b-card-footer v-if=\"$props['for'] !== 'view'\">\n            <b-button\n                variant=\"outline-secondary\"\n                @click=\"onAdd(index+1,innerModel)\"\n            >\n              <t>app.add</t>\n            </b-button>\n          </b-card-footer>\n          ")
                ]),
                _: 2 /* DYNAMIC */
              }, 1024 /* DYNAMIC_SLOTS */)
            ]),
            _: 2 /* DYNAMIC */
          }, 1024 /* DYNAMIC_SLOTS */))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      _: 3 /* FORWARDED */
    }, 8 /* PROPS */, ["onDrop", "get-ghost-parent"]),
    _createCommentVNode("\n    <b-button\n        v-if=\"model[field].length === 0 && $props['for'] !== 'view'\"\n        variant=\"outline-secondary\"\n        @click=\"onAdd(0)\">\n      <t>app.add</t>\n    </b-button>\n\n    <bk-modal :id=\"modalId\" v-if=\"getTypeField\" @ok=\"onSubmitModal\">\n      <bk-input :model=\"modalModel\" :field=\"getTypeField\"/>\n    </bk-modal>\n    "),
    (_ctx.model[_ctx.field].length>0 && _ctx.$props['for'] !== 'view')
      ? (_openBlock(), _createBlock(_component_b_row, {
          key: 1,
          class: "mt-2"
        }, {
          default: _withCtx(() => [
            (_ctx.getTypeField)
              ? (_openBlock(), _createBlock(_component_b_col, { key: 0 }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_form_select, {
                      modelValue: _ctx.insertModel.selected,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.insertModel.selected) = $event))
                    }, {
                      default: _withCtx(() => [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.enumOptions, (option) => {
                          return (_openBlock(), _createBlock(_component_b_form_select_option, {
                            key: option.key,
                            value: option.value
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(option.key), 1 /* TEXT */)
                                ]),
                                _: 2 /* DYNAMIC */
                              }, 1024 /* DYNAMIC_SLOTS */)
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["modelValue"])
                  ]),
                  _: 1 /* STABLE */
                }))
              : _createCommentVNode("v-if", true),
            (!_ctx.$attrs.noNumber)
              ? (_openBlock(), _createBlock(_component_b_col, { key: 1 }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_form_input, {
                      type: "number",
                      modelValue: _ctx.insertModel.number,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.insertModel.number) = $event))
                    }, null, 8 /* PROPS */, ["modelValue"])
                  ]),
                  _: 1 /* STABLE */
                }))
              : _createCommentVNode("v-if", true),
            _createVNode(_component_b_col, null, {
              default: _withCtx(() => [
                _createVNode(_component_b_button, {
                  variant: "outline-secondary",
                  onClick: _cache[5] || (_cache[5] = $event => (_ctx.onAddSubClass(-1)))
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [...(_cache[7] || (_cache[7] = [
                        _createTextVNode("app.add", -1 /* CACHED */)
                      ]))]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }))
      : _createCommentVNode("v-if", true)
  ], 512 /* NEED_PATCH */))
}
_sfc_main.render = render;
