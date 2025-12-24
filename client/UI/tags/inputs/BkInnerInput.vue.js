
import {Class, ValidationError, ScalarField, ObjectField, ListField, Union} from 'meteor/akyma:astronomy'
import {I18n,DateTime,Enum,Lifecycle} from "meteor/akyma:bk"
import _ from "lodash";
import BkBelongsToInput from "./BkBelongsToInput.vue.js";
import BkFieldList from "../forms/BkFieldList.vue.js";
import BkCardListClass from "../forms/BkCardListClass.vue.js";

  function isGenericInputType(originalFieldType = "") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    // Number removed, since Number authorizes decimals. Integer will use "number" input type
    return ["text", "email", "password", "search", "url", "tel", "date", "time", "range", "color"].includes(fieldType);

  }

  function getInheritedFieldType(originalFieldType = "") {
    let inheritedFieldType = {
      "integer": "number",
      "amount": "number"
    }
    return inheritedFieldType[originalFieldType.toLowerCase()];
  }

  const _sfc_main = {
    name: "BkInnerInput",
    components: {BkCardListClass, BkBelongsToInput,BkFieldList},
    props: {
      model: {
        type: Class,
        required: true
      },
      field: {
        type: String,
        required: true
      },
      formField: String,
      formGenericField: String,
      // When true, formGenericField doesn't append ".field" in computeFormGenericField
      isCompleteFormGenericField: {
        type: Boolean,
        default: false,
      },
      for: String,
      plaintext: Boolean,
      showAlert: Boolean,
      noState: {
        type: Boolean,
        default: false
      },
      validateServerSide: {
        type: Boolean,
        default: false
      },
      labelContext: Object,
    },
    inject: ["formModel"],
    data() {
      return {
        oldValue: null,
        invalidTagText: "Tag is invalid",
        isMounted: false,
      }
    },
    mounted() {
      this.isMounted = true;
    },
    unmounted() {
      this.isMounted = false;
    },
    destroyed() {
      // Vue 2 compatibility
      if (typeof this.unmounted === 'function') this.unmounted();
    },

    created() {
      // oldValue will be used to check value when component created and value in the screen
      this.oldValue = _.cloneDeep(this.model.raw(this.field));
    },

    computed: {
      value: {
        set: function (value) {
          let validateServerSide = this.definition.validateServerSide || this.validateServerSide
          if (value === null || value === "") { value = undefined }
          this.model.set(this.field, value, {cast: true})
          this.model.isValid(this.field,{simulationOnly: !validateServerSide, formModel: this.formModel})
          // Avoid emit input 2 times but still needed on BkBelongsToMany tags because of filter purpose
          if (!['ListRelation','Relation'].includes(this.definitionField))
            this.$emit("input",value)
        },
        get: function () {
          let v = this.model.get(this.field)
          if (v instanceof Date && this.definition.type.name === "Date") {
            return DateTime.getISODateString(v)
          }
          return v
        }
      },
      definition() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return {};
        }
        return fieldDefinition
      },
      fieldType() {
        return this.definition.type.name
      },
      ui() {
        if (this.noUI) {return {}}
        return this.definition.ui || {}
      },
      debounce() {
        if (this.$attrs.debounce)
          return this.$attrs.debounce
        let validateServerSide = this.definition.validateServerSide || this.validateServerSide
        if (this.definition.debounce > 0)
          return this.definition.debounce
        if (validateServerSide)
          return 250
      },
      maxTags() {
        const maxTags = this.ui.maxTags
        if (typeof maxTags === "function")
            return maxTags(this.formModel || this.model)
        return maxTags
      },
      definitionKey() {
        let key = this.definition.key
        if (typeof key === "function")
          key = key(this.formModel || this.model)
        return key
      },

      uiSwitch() {
        if (this.ui.switch === undefined) return true
        return this.ui.switch
      },

      uiComponentProps() {
        if (this.ui.props && typeof this.ui.props === "object") return this.ui.props
        return {}
      },

      formGenericFieldComputed() {
        if (this.formGenericField && this.isCompleteFormGenericField)
          return this.formGenericField
        if (this.formGenericField)
          return this.formGenericField + "." + this.field
        return this.formFieldComputed
      },

      formFieldComputed() {
        return this.formField && this.formField + "." + this.field || this.field;
      },

      // If for view or if readonly field, return true
      plaintextComputed() {
        if (this.$props.for === "view") {
          return true;
        }

        // isNew is only known in the formModel, not in embedded models
        let isNew = (this.formModel) ? this.formModel.constructor.isNew(this.formModel) : this.model.constructor.isNew(this.model)

        // Check canEdit at model level instead of traversing formModel
        // to avoid too much calculation. But, we could do this also
        // !this.formModel.canEdit(this.formField)
        if (!this.model.canEdit(this.field,isNew,this.formModel)) {
          return true;
        }
        return this.$props.plaintext;
      },
      required() {
        return false; //!this.model.getDefinition(this.field, "optional");
      },
      optional() {
        if (typeof this.definition.optional === "function")
          return this.definition.optional(this.model, this.formModel)
        else
          return this.definition.optional
      },
      getUnionTypes() {
        let fieldDefinition = this.model.getDefinition(this.field);
        let fieldType = fieldDefinition.type.name;
        if (Object.keys(Union.unions).includes(fieldType)) {
          return fieldDefinition.type.class.types
        }
        return []
      },
      definitionField() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }
        // let definitionClass = fieldDefinition.constructor.name;
        let fieldClass = fieldDefinition.type.class;
        let fieldType = fieldDefinition.type.name;

        /* Object fields - subclasses */
        if (fieldDefinition instanceof ObjectField) {
          if (fieldDefinition.relation) {
            return "Relation";
          }
          return "Object";
        }

        /* List fields */
        if (fieldDefinition instanceof ListField) {
          if (fieldDefinition.relation) {
            return "ListRelation";
          }
          // it's a new class object
          if (Class.includes(fieldClass)) {
            return "ListClass";
          }
          // We can have a form tag since we have string values
          if (fieldClass.prototype instanceof String
          || typeof fieldClass === "string"
          || fieldType === "String") {
            //this.value = this.value.join(", ");
            return "ListString"
          }
          if (Enum.includes(fieldClass)) {
            return "ListEnum"
          }
          return "ListValue";
        }

        /* Scalar fields */
        if (fieldDefinition instanceof ScalarField) {
          if (fieldDefinition.relation) {
            return "Relation";
          }
          if (Enum.includes(fieldClass)) {
            return "Enum";
          }
          if (Lifecycle.includes(fieldClass)) {
            return "Lifecycle";
          }
          if (fieldType === "Boolean") {
            return "Boolean"
          }
          if (fieldType === "Image") {
            return "Image"
          }
          if (fieldType === "Rating") {
            return "Rating"
          }
          return "Scalar";
        }
      },
      inputType() {
        if (this.inputComponent === "BFormInput") {
          let fieldDefinition = this.model.getDefinition(this.field);
          let fieldType = fieldDefinition.type.name;

          if (fieldDefinition.ui && fieldDefinition.ui.type) {
            return fieldDefinition.ui.type;
          }

          // Field is type Date and readonly, avoiding showing jj/mm/aaaa when empty value
          if (fieldType === "Date" && this.plaintextComputed && !this.value)
            return "text"

          // Field Type is a generic Input Type
          if (isGenericInputType(fieldType)) {
            return fieldType.toLowerCase()
          }

          return getInheritedFieldType(fieldType);

        }
        return undefined;
      },
      step() {
        const steps = {
          "Amount": "0.01",
          "Number": "0.001",
          "Integer": "1"
        }
        return steps[this.fieldType]
      },
      inputComponent() {
        let fieldDefinition = this.model.getDefinition(this.field);
        // Check if field really exists :
        if (!fieldDefinition) {
          return null;
        }

        // Allow forcing template in field definition, ui part
        if (fieldDefinition.ui && fieldDefinition.ui.template) {
          return fieldDefinition.ui.template;
        }

        let fieldType = fieldDefinition.type.name;
        let templateType = fieldType.toLowerCase();
        let fieldClass = fieldDefinition.type.class;

        if (isGenericInputType(fieldType) || fieldType === "String" || fieldType === "TrimmedString") {
          return "BFormInput";
        }

        /*
        if (fieldType === "Date") {
          return "BFormDatepicker"
        }

        if (fieldType === "Time") {
          return "BFormTimepicker"
        }
        */

        if (fieldType === "DateTime") {
          return "BkDatePicker"
        }

        if (fieldType === "Textarea") {
          return "BFormTextarea"
        }

        if (fieldType === "TextEditor") {
          if (Meteor.isClient && this["for"]!== "view")
            return "BkTextEditor"
          else
            return "BkViewClean"
        }

        // Only if Scalar field. ListEnum and ListBoolean treated differently
        if (Enum.includes(fieldClass)) {
          if (this.plaintextComputed) {
            return "BkViewClean";
          } else {
            return "BFormRadioGroup"
          }
        }

        if (Lifecycle.includes(fieldClass)) {
          return "BkViewClean"
        }

        if (fieldType === "Boolean") {
          return "BFormCheckbox"
        }

        return "BFormInput"
      },
      plaintextClass() {
        if (this.inputComponent === "BkViewClean")
          return "form-control-plaintext"
        return ""
      },
      inputGroupClass() {
        let defaultClass = this.ui.class || ""
        if (this.$props['for'] === "filter"
        && (this.definitionField === 'ListEnum' && !this.ui.template
         || this.inputComponent === 'BFormRadioGroup')
        )
          return defaultClass + " overflow-scroll-x"
        return defaultClass
      },
    },

    methods: {
      tagValidator(tag) {
        let model = new (this.model.constructor)();
        model.set(this.field,[tag]); // tag is in an array
        try {
          model.validate({fields: this.field})
        } catch(err) {
          if (ValidationError.is(err)) {
            //TODO should be managed by I18n
            this.invalidTagText = err.details[0].message;
            return false
          }
        }
        return true;
      },
      onPaste(e) {
        if (this.ui.preventPaste) e.preventDefault();
      }
    },

    meteor: {
      placeholder() {
        if (this.plaintextComputed) return ""
        return I18n.t(this.model.constructor.getPlaceHolderKey(this.field),{ignoreNotFound: true});
      },
      append() {
        let append = this.ui.append;
        if (typeof append === "function") append = append({model:this.model, doc:this.model, parent: this.formModel, field:this.field});
        if (append && append.includes(".")) return I18n.t(append);
        return append;
      },
      prepend() {
        let prepend = this.ui.prepend;
        if (typeof prepend === "function") prepend = prepend({model:this.model, doc:this.model, parent: this.formModel, field:this.field});
        if (prepend && prepend.includes(".")) return I18n.t(prepend);
        return prepend;
      },
      enumOptions() {
        // Avoid passing an array to bkViewClean which expect an object for translations options
        if (this.plaintextComputed
            && this.inputComponent === "BkViewClean"
            && this.definitionField !== 'ListEnum'
            && !this.ui.template
        )
          return

        let fieldDefinition = this.definition

        let fieldType = fieldDefinition.type.name;
        let EnumClass = fieldDefinition.type.class
        if (! Enum.enums[fieldType]) { return }

        let getOptionsParam = {}
        getOptionsParam.optional = this.optional && fieldDefinition instanceof ScalarField
        getOptionsParam.sort = fieldDefinition.sort

        if (this.labelContext ){
          if (this.labelContext.name && this.labelContext.value){
            getOptionsParam[this.labelContext.name] = this.labelContext.value
          }
        }
        return EnumClass.getOptions(getOptionsParam);
        /*
        let identifiers = EnumClass.getIdentifiers(this.formModel || this.model)

        let options = _.map(identifiers, x => {
              let key = EnumClass.getLabelKey(x);
              return {"text": I18n.t(key), key, "value": x}
            }
        )

        if (this.optional && fieldDefinition instanceof ScalarField) {
          let key = "app.undefined"
          options.splice(0,0,{ text: I18n.t(key), key, value: undefined})
        }

        if (fieldDefinition.sort) {
          return options.sort((x,y) => x.text.localeCompare(y.text))
        }

        return options;
        */
      },
      state() {
        let errors = this.model.getError(this.field);
        if (this.noState) return null
        if (errors) {
          this.$emit("validationError", errors.map((value, key) => value.message).join('<br/>'))
          this.$emit("state", false);
          return false
        } else {
          if (_.isEqual(this.value, this.oldValue) || !this.isMounted) {
            this.$emit("state", null)
            return null
          } else {
            this.$emit("state", true)
            return true
          }
        }
      }
    },
  }


export default _sfc_main;

import { normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, resolveComponent as _resolveComponent, mergeProps as _mergeProps, withCtx as _withCtx, renderList as _renderList, createSlots as _createSlots, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, Fragment as _Fragment, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveDynamicComponent as _resolveDynamicComponent, resolveDirective as _resolveDirective, withDirectives as _withDirectives } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_bk_card_list_class = _resolveComponent("bk-card-list-class")
  const _component_t = _resolveComponent("t")
  const _component_b_form_checkbox = _resolveComponent("b-form-checkbox")
  const _component_b_form_checkbox_group = _resolveComponent("b-form-checkbox-group")
  const _component_b_img = _resolveComponent("b-img")
  const _component_b_form_radio = _resolveComponent("b-form-radio")
  const _component_b_form_radio_group = _resolveComponent("b-form-radio-group")
  const _component_b_form_tags = _resolveComponent("b-form-tags")
  const _component_b_form_rating = _resolveComponent("b-form-rating")
  const _component_bk_belongs_to_many = _resolveComponent("bk-belongs-to-many")
  const _component_b_input_group = _resolveComponent("b-input-group")
  const _directive_dragscroll = _resolveDirective("dragscroll")

  return _withDirectives((_openBlock(), _createBlock(_component_b_input_group, _mergeProps(_ctx.$attrs, {
    prepend: _ctx.prepend,
    append: _ctx.append,
    class: _ctx.inputGroupClass,
    key: _ctx.definitionKey
  }), {
    default: _withCtx(() => [
      _renderSlot(_ctx.$slots, 'before-'+_ctx.formGenericFieldComputed, _normalizeProps(_guardReactiveProps({..._ctx.$props, ...{value: _ctx.value,oldValue: _ctx.oldValue}}))),
      _renderSlot(_ctx.$slots, _ctx.formGenericFieldComputed, _normalizeProps(_guardReactiveProps({..._ctx.$props,formModel: _ctx.formModel, plaintext: _ctx.plaintextComputed, required: !_ctx.optional, placeholder: _ctx.placeholder, value: _ctx.value, oldValue: _ctx.oldValue, append: _ctx.append, prepend: _ctx.prepend, state: _ctx.state, options: _ctx.enumOptions, class: _ctx.plaintextClass})), () => [
        (_ctx.definitionField === 'Object')
          ? (_openBlock(), _createBlock(_component_bk_field_list, _mergeProps({ key: 0 }, {..._ctx.$props,..._ctx.$attrs,..._ctx.uiComponentProps, plaintext: _ctx.plaintextComputed }, {
              class: "col-12",
              model: _ctx.model.get(_ctx.field),
              "form-field": _ctx.formFieldComputed,
              onChange: _cache[0] || (_cache[0] = $event => (_ctx.$emit('change'))),
              fields: ""
            }), _createSlots({ _: 2 /* DYNAMIC */ }, [
              _renderList(_ctx.$scopedSlots, (_, slot) => {
                return {
                  name: slot,
                  fn: _withCtx((props) => [
                    _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                  ])
                }
              })
            ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "form-field"]))
          : (_ctx.definitionField === 'ListClass')
            ? (_openBlock(), _createBlock(_component_bk_card_list_class, _mergeProps({ key: 1 }, {..._ctx.$props,..._ctx.$attrs,..._ctx.uiComponentProps}, {
                model: _ctx.model,
                field: _ctx.field,
                "form-field": _ctx.formFieldComputed
              }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                _renderList(_ctx.$scopedSlots, (_, slot) => {
                  return {
                    name: slot,
                    fn: _withCtx((props) => [
                      _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                    ])
                  }
                })
              ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-field"]))
            : (_ctx.definitionField === 'ListEnum' && !_ctx.ui.template)
              ? (_openBlock(), _createBlock(_component_b_form_checkbox_group, _mergeProps({ key: 2 }, {..._ctx.$props,..._ctx.$attrs,..._ctx.uiComponentProps}, {
                  modelValue: _ctx.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.value) = $event)),
                  name: _ctx.field,
                  disabled: _ctx.plaintextComputed,
                  class: "form-control-plaintext"
                }), {
                  default: _withCtx(() => [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.enumOptions, (item) => {
                      return (_openBlock(), _createBlock(_component_b_form_checkbox, {
                        value: item.value,
                        key: item.value
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_t, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(item.key), 1 /* TEXT */)
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1024 /* DYNAMIC_SLOTS */)
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
                    }), 128 /* KEYED_FRAGMENT */))
                  ]),
                  _: 1 /* STABLE */
                }, 16 /* FULL_PROPS */, ["modelValue", "name", "disabled"]))
              : (_ctx.definitionField === 'Image')
                ? (_openBlock(), _createBlock(_component_b_img, {
                    key: 3,
                    src: _ctx.value
                  }, null, 8 /* PROPS */, ["src"]))
                : (_ctx.inputComponent === 'BFormRadioGroup' && _ctx.definitionField === 'Enum')
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [
                      _createCommentVNode("\n      Issue with radio group badly linked together when shouldn't\n      So we need to set \"name\" attribute as different value for each radio-group\n      "),
                      (_openBlock(), _createBlock(_component_b_form_radio_group, _mergeProps({..._ctx.$props,..._ctx.$attrs,..._ctx.uiComponentProps}, {
                        modelValue: _ctx.value,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.value) = $event)),
                        name: _ctx.formFieldComputed,
                        key: _ctx.formFieldComputed,
                        disabled: _ctx.plaintextComputed,
                        class: "form-control-plaintext"
                      }), {
                        default: _withCtx(() => [
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.enumOptions, (item) => {
                            return (_openBlock(), _createBlock(_component_b_form_radio, {
                              value: item.value,
                              key: item.value
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_t, null, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(item.key), 1 /* TEXT */)
                                  ]),
                                  _: 2 /* DYNAMIC */
                                }, 1024 /* DYNAMIC_SLOTS */)
                              ]),
                              _: 2 /* DYNAMIC */
                            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
                          }), 128 /* KEYED_FRAGMENT */))
                        ]),
                        _: 1 /* STABLE */
                      }, 16 /* FULL_PROPS */, ["modelValue", "name", "disabled"]))
                    ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                  : (_ctx.definitionField === 'ListString')
                    ? (_openBlock(), _createBlock(_component_b_form_tags, _mergeProps({ key: 5 }, _ctx.uiComponentProps, {
                        modelValue: _ctx.value,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.value) = $event)),
                        state: _ctx.state,
                        "remove-on-delete": "",
                        separator: " ",
                        "tag-validator": _ctx.tagValidator,
                        "invalid-tag-text": _ctx.invalidTagText,
                        placeholder: _ctx.placeholder,
                        disabled: _ctx.plaintextComputed
                      }), {
                        "add-button-text": _withCtx(() => [
                          _createVNode(_component_t, null, {
                            default: _withCtx(() => [...(_cache[15] || (_cache[15] = [
                              _createTextVNode("app.add", -1 /* CACHED */)
                            ]))]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        _: 1 /* STABLE */
                      }, 16 /* FULL_PROPS */, ["modelValue", "state", "tag-validator", "invalid-tag-text", "placeholder", "disabled"]))
                    : (_ctx.definitionField === 'Rating')
                      ? (_openBlock(), _createBlock(_component_b_form_rating, _mergeProps({ key: 6 }, _ctx.uiComponentProps, {
                          modelValue: _ctx.value,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.value) = $event)),
                          variant: _ctx.ui.variant,
                          color: _ctx.color,
                          readonly: _ctx.plaintextComputed,
                          size: _ctx.size,
                          "show-clear": "",
                          "icon-clear": "x-circle"
                        }), null, 16 /* FULL_PROPS */, ["modelValue", "variant", "color", "readonly", "size"]))
                      : (_ctx.definitionField === 'Relation')
                        ? (_openBlock(), _createBlock(_component_bk_belongs_to_many, _mergeProps({ key: 7 }, {..._ctx.$attrs,..._ctx.uiComponentProps}, {
                            modelValue: _ctx.value,
                            "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((_ctx.value) = $event)),
                            model: _ctx.model,
                            field: _ctx.field,
                            "form-field": _ctx.formFieldComputed,
                            for: _ctx.$props['for'],
                            placeholder: _ctx.placeholder,
                            plaintext: _ctx.plaintextComputed,
                            readonly: _ctx.plaintextComputed,
                            disabled: _ctx.plaintextComputed,
                            "max-tags": _ctx.maxTags,
                            onSelect: _cache[6] || (_cache[6] = $event => (_ctx.$emit('select',$event))),
                            onInput: _cache[7] || (_cache[7] = $event => (_ctx.$emit('input'))),
                            onReady: _cache[8] || (_cache[8] = $event => (_ctx.$emit('ready'))),
                            onTag: _cache[9] || (_cache[9] = $event => (_ctx.$emit('tag',$event)))
                          }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                            _renderList(_ctx.$scopedSlots, (_, slot) => {
                              return {
                                name: slot,
                                fn: _withCtx((props) => [
                                  _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                                ])
                              }
                            })
                          ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["modelValue", "model", "field", "form-field", "for", "placeholder", "plaintext", "readonly", "disabled", "max-tags"]))
                        : (_ctx.definitionField === 'ListRelation')
                          ? (_openBlock(), _createBlock(_component_bk_belongs_to_many, _mergeProps({ key: 8 }, {..._ctx.$attrs,..._ctx.uiComponentProps}, {
                              model: _ctx.model,
                              field: _ctx.field,
                              "form-field": _ctx.formFieldComputed,
                              for: _ctx.$props['for'],
                              plaintext: _ctx.plaintextComputed,
                              readonly: _ctx.plaintextComputed,
                              disabled: _ctx.plaintextComputed,
                              "max-tags": _ctx.maxTags,
                              onSelect: _cache[10] || (_cache[10] = $event => (_ctx.$emit('select',$event))),
                              onInput: _cache[11] || (_cache[11] = $event => (_ctx.$emit('input'))),
                              onReady: _cache[12] || (_cache[12] = $event => (_ctx.$emit('ready'))),
                              onTag: _cache[13] || (_cache[13] = $event => (_ctx.$emit('tag',$event)))
                            }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                              _renderList(_ctx.$scopedSlots, (_, slot) => {
                                return {
                                  name: slot,
                                  fn: _withCtx((props) => [
                                    _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                                  ])
                                }
                              })
                            ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-field", "for", "plaintext", "readonly", "disabled", "max-tags"]))
                          : (_ctx.definitionField === 'ListValue')
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 9 }, [
                                _createCommentVNode(" TODO: is span OK ?"),
                                _createElementVNode("span", null, _toDisplayString(_ctx.model[_ctx.field].join(', ')), 1 /* TEXT */)
                              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                            : (_openBlock(), _createElementBlock(_Fragment, { key: 10 }, [
                                _createCommentVNode(" inputText + view + ... "),
                                (_openBlock(), _createBlock(_resolveDynamicComponent(_ctx.inputComponent), _mergeProps({..._ctx.$attrs,..._ctx.uiComponentProps}, {
                                  class: _ctx.plaintextClass,
                                  type: _ctx.inputType,
                                  modelValue: _ctx.value,
                                  "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((_ctx.value) = $event)),
                                  onPaste: _ctx.onPaste,
                                  model: _ctx.model,
                                  field: _ctx.field,
                                  state: _ctx.state,
                                  for: _ctx.$props['for'],
                                  placeholder: _ctx.placeholder,
                                  name: _ctx.field,
                                  plaintext: _ctx.plaintextComputed,
                                  readonly: _ctx.plaintextComputed,
                                  disabled: _ctx.plaintextComputed,
                                  options: _ctx.enumOptions,
                                  switch: _ctx.uiSwitch,
                                  "max-tags": _ctx.maxTags,
                                  debounce: _ctx.debounce,
                                  step: _ctx.step,
                                  rows: "3",
                                  "max-rows": "8"
                                }), null, 16 /* FULL_PROPS */, ["class", "type", "modelValue", "onPaste", "model", "field", "state", "for", "placeholder", "name", "plaintext", "readonly", "disabled", "options", "switch", "max-tags", "debounce", "step"]))
                              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
      ]),
      _renderSlot(_ctx.$slots, 'after-'+_ctx.formGenericFieldComputed, _normalizeProps(_guardReactiveProps({..._ctx.$props, ...{value: _ctx.value,oldValue: _ctx.oldValue}})))
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */, ["prepend", "append", "class"])), [
    [
      _directive_dragscroll,
      true,
      void 0,
      { x: true }
    ],
    [
      _directive_dragscroll,
      false,
      void 0,
      { y: true }
    ]
  ])
}
_sfc_main.render = render;
