
import {Class} from "meteor/akyma:astronomy";
import {I18n} from "meteor/akyma:bk";
import {_} from "lodash";

const _sfc_main = {
  name: "BkBelongsToInput",
  props: {
    model: Class,
    field: String,
    placeholder: String,
  },
  data() {
    return {
      oldValue: null,
      value: undefined,
      options: [],
      dropDownVisible: false,
      handler: undefined,
      relationList: [],
      relationOne: "",
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true;
  },
  unmounted() {
    this.handler && this.handler.stop();
    this.isMounted = false;
  },
  destroyed() {
    // Vue 2 compatibility
    if (typeof this.unmounted === 'function') this.unmounted();
  },
  created() {
    let fieldDefinition = this.model.getDefinition(this.field)
    this.oldValue = this.getId

    if (this.oldValue || this.selectInput)
      this.activateSubscription()
  },

  computed: {
    definition() {
      return this.model.getDefinition(this.field)
    },
    getId() {
      let definition = this.definition
      if (definition.cache && typeof this.model[this.field] === "object") {
        return this.model[this.field] && this.model[this.field]._id
      } else {
        return this.model[this.field]
      }
    },
    selectInput() {
      return this.minCharacters === 0;
    },
    minCharacters() {
      let definition = this.definition
      if (!definition) return 3
      let min = definition.minCharacters
      if (typeof min === "function") {
        min = min({model: this.model, field: this.field})
      }
      if (min === undefined || min === null || isNaN(min)) return 3
      return min;
    },
    where() {
      let definition = this.definition
      let where = definition.where.call(
          this.model, // set this in where function to this.model
          this.getId, this.value, I18n.getLanguage()
      ) //TODO where not found
      if (!where) return;
      if (!where.search && !where.param) where = { search: where }
      return where
    },
    selectValue: {
      set: function (value) {
        if (value === null || value === "") {
          value = undefined
        }
        // TODO: manage cached object
        this.setId(value)
        //this.model.set(this.field, value, {cast: true})
        //this.model.isValid(this.field);
      },
      get: function () {
        return this.model.get(this.field);
      }
    },
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, relation is removed
        this.setId()
        //this.model[this.field] = undefined;

        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= this.minCharacters)
          this.activateSubscription();
        // We unsubscribe if subscription exists and if not 3 characters
        if (this.getId === undefined && value.length < this.minCharacters) {
          this.handler && this.handler.stop();
          this.hideDropDown();
          this.relationList = [];
        }
      },
      get() {
        return this.value;
      }
    },
    inputRelation: {
      set(value) {
        let defaultName = this.relation && this.relation.defaultName()
        if (value === defaultName) return
        if (value.startsWith(defaultName)) {
          this.inputRelation = defaultName;
          return
        }
        if (!value || value !== defaultName) {
          this.value = ""
          // unset field and check validation if empty
          this.setId()
          //this.model.set(this.field);
          //this.model.isValid(this.field);
          // Stop subscription
          this.handler && this.handler.stop()
        }
      },
      get() {
        // We are on an issue where this.model[this.field] is not an ID
        if (this.relationOne === "" || this.relationOne === undefined)
          return this.model[this.field]
        return this.relationOne;
      }
    },
    relation() {
      return this.model[this.field + "Instance"]();
    },
    dropDownId() {
      return "Dropdown_" + this.field + "_" + this._uid;
    },
  },
  meteor: {
    state() {
      // Similar has management found in BkInnerInput but value checked is relation_id
      let errors = this.model.getError(this.field);
      if (errors) {
        this.$emit("validationError", errors.map((value, key) => value.message).join('<br/>'))
        this.$emit("state", false);
        return false
      } else {
        if (_.isEqual(this.getId, this.oldValue) || !this.isMounted) {
          this.$emit("state", null)
          return null
        } else {
          this.$emit("state", true)
          return true
        }
      }
    },
  },
  watch: {
    // Used if model value updated outside of this component
    getId(newValue, oldValue) {
      if (newValue === undefined) return
      let definition = this.definition
      if (definition.cache) {
        if (newValue && newValue._id === oldValue && oldValue._id) return
      } else {
        if (newValue === oldValue) return
      }

      this.activateSubscription()
    }
  },
  methods: {
    setId(id) {
      let definition = this.definition
      if (definition.cache) {
        if (this.model[this.field] && this.model[this.field]._id === id)
          return
        this.$emit("input",{_id: id})
        //this.model[this.field] = { _id: id }
      } else {
        if (this.model[this.field] !== id)
          this.$emit("input",id)
        //this.model[this.field] = id
      }
    },
    activateSubscription() {
      let oldHandler = this.handler;

      let subscriptionName = this.definition.subscription || this.field + ".search"
      this.handler = Meteor.subscribe(
          subscriptionName,
          this.getId, this.value, I18n.getLanguage(),
          this.where
      )

      Tracker.autorun(() => {
        let ready = this.handler.ready();
        if (ready) {
          oldHandler && oldHandler.stop()
          this.populate()
        }
      })
    },

    populate() {
      let definition = this.definition
      if (this.selectInput) {
        this.relationList = this.getOptionsFromRelations()
        if (this.relationList.length === 1 && !definition.optional) {
          //this.model[this.field] = this.relationList[0].value;
          this.setId(this.relationList[0].value);
          this.$refs.select.$el.disabled = true
        }
        return
      }
      if (this.getId) {
        let relation = this.model[this.field + "Instance"]();
        this.relationOne = relation && relation.defaultName();
        return
      }
      this.relationList = this.getOptionsFromRelations()
      if (this.relationList.length === 1 && !definition.optional) {
        this.onSelectRow(this.relationList[0])
        this.populate()
        return
      }
      this.showDropDown();
    },
    getOptionsFromRelations() {
      let definition = this.definition
      let relationClass = definition.relation;
      let where = this.where
      if (!where) return;
      let result = relationClass && relationClass.find(where.search).map(record => {
        return {
          value: record._id,
          text: record.defaultName()
        }
      }).sort((a,b) => (a.text <= b.text) ? -1 : 1)
      if (definition.optional && Array.isArray(result)) {
        result.unshift({
          value: undefined,
          text: " "
        })
      }
      return result
    },
    showDropDown() {
      if (this.dropDownVisible) return;
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    hideDropDown() {
      if (!this.dropDownVisible) return;
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    // If collapse appears and we hit down arrow, we select first element
    onKeyDown(e) {
      if (!this.dropDownVisible) return;
      this.$refs.selectableTable.$el.getElementsByTagName("tr")[1].focus();
    },
    // If collapse appears and we hit up arrow, we select last element
    onKeyUp(e) {
      if (!this.dropDownVisible) return;
      let elements = this.$refs.selectableTable.$el.getElementsByTagName("tr");
      elements[elements.length-1].focus();
    },
    // Prevent typing anything when City chosen
    onKeyDownRelation(e) {
      let defaultName = this.relation && this.relation.defaultName();
      if (e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab")
        e.preventDefault()
      if (e.key === "Backspace") {
        this.value = ""
        this.setId()
      }
    },
    // When we click on row or hit enter when selected
    onSelectRow(row) {
      //this.model.set(this.field, row.value, {cast: true})
      this.setId(row.value)
      this.value = "";
      if (this.relationList.length !== 1)
        this.activateSubscription(); // since value length is lower than 3
      this.hideDropDown();
      this.model.isValid(this.field);
    },
  },
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, mergeProps as _mergeProps, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, withKeys as _withKeys, createVNode as _createVNode, Fragment as _Fragment, createElementBlock as _createElementBlock, withCtx as _withCtx } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  key: 1,
  class: "col-12 no-padding-left no-padding-right"
}

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_b_form_select = _resolveComponent("b-form-select")
  const _component_b_form_input = _resolveComponent("b-form-input")
  const _component_b_table = _resolveComponent("b-table")
  const _component_b_collapse = _resolveComponent("b-collapse")

  return ($options.selectInput)
    ? (_openBlock(), _createBlock(_component_b_form_select, _mergeProps({
        key: 0,
        ref: "select"
      }, _ctx.$attrs, {
        modelValue: $options.selectValue,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($options.selectValue) = $event)),
        placeholder: $props.placeholder,
        options: $data.relationList,
        state: _ctx.state
      }), null, 16 /* FULL_PROPS */, ["modelValue", "placeholder", "options", "state"]))
    : (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _createCommentVNode(" if we are on the search input "),
        ($props.model[$props.field]===undefined)
          ? (_openBlock(), _createBlock(_component_b_form_input, _mergeProps({ key: 0 }, _ctx.$attrs, {
              modelValue: $options.inputValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($options.inputValue) = $event)),
              type: "search",
              state: _ctx.state,
              placeholder: $props.placeholder,
              onKeydown: [
                _withKeys($options.onKeyUp, ["arrow-up"]),
                _withKeys($options.onKeyDown, ["arrow-down"])
              ]
            }), null, 16 /* FULL_PROPS */, ["modelValue", "state", "placeholder", "onKeydown"]))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _createCommentVNode(" if we are on the relation defaultName input "),
              _createVNode(_component_b_form_input, _mergeProps({ ref: "relationInput" }, _ctx.$attrs, {
                modelValue: $options.inputRelation,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (($options.inputRelation) = $event)),
                type: "search",
                state: _ctx.state,
                onKeydown: $options.onKeyDownRelation
              }), null, 16 /* FULL_PROPS */, ["modelValue", "state", "onKeydown"])
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)),
        _createVNode(_component_b_collapse, {
          id: $options.dropDownId,
          class: "mt-2"
        }, {
          default: _withCtx(() => [
            ($data.dropDownVisible)
              ? (_openBlock(), _createBlock(_component_b_table, {
                  key: 0,
                  hover: "",
                  borderless: "",
                  "thead-class": "d-none",
                  "value-td-class": "d-none",
                  items: $data.relationList,
                  fields: ["value","text"],
                  selectable: "",
                  "select-mode": "single",
                  ref: "selectableTable",
                  onRowClicked: $options.onSelectRow
                }, {
                  "cell(value)": _withCtx((data) => [...(_cache[3] || (_cache[3] = []))]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["items", "onRowClicked"]))
              : _createCommentVNode("v-if", true)
          ]),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["id"])
      ]))
}
_sfc_main.render = render;
