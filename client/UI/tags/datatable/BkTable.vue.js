
  import { Tracker } from "meteor/tracker"
  import { Class, ValidationError } from "meteor/akyma:astronomy";
  import _omit from "lodash/omit";
  import { Container, Draggable } from "vue-smooth-dnd";
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";
  import BkButtonIcon from "../links/BkButtonIcon.vue.js";
  import BkModal from "../modals/BkModal.vue.js";
  import BkForm from "../forms/BkForm.vue.js";
  import BkViewInner from "../views/BkViewInner.vue.js";
  import BkPagination from "./BkPagination.vue.js";
  import BkLoading from "../loading/BkLoading.vue.js";
  import {EJSON} from "meteor/ejson";
  import errorPopupMixin from "../../../utils/errorPopupMixin";
  import BkExportToXlsxButton from "../links/BkExportToXlsxButton.vue.js";

  const _sfc_main = {
    name: "BkTable",
    components: {BkExportToXlsxButton, BkPagination, BkButtonIcon,BkModal,BkForm,BkViewInner,Container,Draggable },
    mixins: [errorPopupMixin],
    props: {
      fields: [Array,String],
      exclude: {
        type: [Array,String]
      },
      exportFields: String,
      editableFields: [String,Array],
      filterClass: Class,
      filterFields: Array,
      noFilterLabel: {
        type: Boolean,
        default: false
      },
      filterButton: {
        type: Boolean,
        default: false
      },
      subscribeFields: [String,Array],
      modalFields: [String,Array],
      modalExclude: [String,Array],
      sort: {
        type: Object,
      },
      sortBy: String,
      sortDesc: Boolean,
      sortValue: Object,
      perPage: Number,
      noPagination: {
        type: Boolean,
        default: false
      },
      page: Number,
      filter: Object, // default filter used, cannot be changer afterwards
      initialFilter: Object, // initial applied filter, can be changed at any time using table filters
      autoFilterSubmit: Boolean, // Auto submit filter fields changes
      // Hide Reset button in filters
      noFilterReset: {
        type: Boolean,
        default: false
      },
      // Params transmitted to subscription's 3rd argument
      subscriptionParams: {
        type: Object,
        default() { return {} }
      },
      autoSubmit: Boolean, // Auto submit editable fields changes
      scroll: Boolean,
      multi: Boolean,
      full: Boolean,
      array: Array,
      model: [String,Class],
      draggable: Boolean,
      card: Boolean,
      cardWithLabel: Boolean,
      minTableWidth: [Number,String],
      actions: {
        type: Array,
        default: function() {return []}
      },
      customActions: Array,
      selector: {
        type: Object,
        default: function() { return {} }
      },
      subscription: String,
      updateRoute: Boolean,
      importFileType: String,
      tdClass: String,
      trClass: String,
      tblClass: String
    },
    data() {
      return {
        sortBySync: this.sortBy,
        sortDescSync: this.sortDesc,
        datatable: new Datatable(this),
        tableModel: Class.getModel(this.model),
        width: window.innerWidth,
        mainKey: 0,
        items: []
      }
    },
    created() {
      window.addEventListener("resize", this.onResize);
      Tracker.autorun(() => {
        this.datatable.readydep.depend()
        if (!this.datatable.handler || this.datatable.handler.ready()) {
          this.items = this.datatable.getArray()
          this.datatable.ready = true
        }
      })
    },
    computed: {
      getFileType() {
        return this.$props.importFileType
      },
      tableClass() {
        if (typeof this.model === "string") {
          return Class.get(this.model)
        }
        return this.model;
      },
      labeledFields() {
        let headers = this.datatable.getHeaders();
        return headers;
      },
      routeQuery() {
        return this.$route && this.$route.query
      },
      firstReady() {
        return this.datatable.firstReady
      },
      cardMode() {
        return this.card || this.width < this.minTableWidth
      },
    },
    meteor: {
      // items() {
      //   //let selection = this.model.find(this.selector).fetch();
      //   //return selection;
      //   return this.datatable.getArray();
      // },
      count() {
        return this.datatable.getCount()
      }
    },
    watch: {
      routeQuery(newValue, oldValue) {
        if (this.updateRoute)
          this.datatable.restoreFilterFromRoute()
      },
    },
    methods: {
      onResize(e) {
        this.width = window.innerWidth;
      },
      onDrop(dropResult){
        if (dropResult.removedIndex === dropResult.addedIndex) return

        let model = this.tableClass
        let keyDragField = model.getFieldsClassByAttribute('dragKey',true)
        if (keyDragField.length === 1){
          let item
          let field = keyDragField[0].name

          //just a switch
          if (Math.abs(dropResult.removedIndex - dropResult.addedIndex) === 1){
            item = this.items[dropResult.removedIndex]
            item.set(field,dropResult.addedIndex + 1)
            item.save()
            item = this.items[dropResult.addedIndex]
            item.set(field,dropResult.removedIndex + 1)
            item.save()
          }else{
            //move down (from 0.. to n)
            if (dropResult.removedIndex < dropResult.addedIndex){
              for (let i = dropResult.removedIndex; i <= dropResult.addedIndex; i++) {
                item = this.items[i]
                if (i === dropResult.removedIndex){
                  item.set(field,dropResult.addedIndex+1)
                  item.save()
                }else{
                  let activeField = item.get(field)
                  item.set(field,activeField-1)
                  item.save()
                }
              }
            }
            //move up (from n to ..0)
            if (dropResult.removedIndex > dropResult.addedIndex){
              for (let i = dropResult.removedIndex; i >= dropResult.addedIndex; i--) {
                item = this.items[i]
                if (i === dropResult.removedIndex){
                  item.set(field,dropResult.addedIndex+1)
                  item.save()
                }else{
                  let activeField = item.get(field)
                  item.set(field,activeField+1)
                  item.save()
                }
              }
            }
          }
        }
      },
      availableSlots() {
        return _omit(this.$scopedSlots, ["head()", "cell(buttonActions)", "cell()"])
      },
      onSort(field) {
        this.datatable.updateSort(field);
      },
      onContextChange(context) {
        if (this.updateRoute)
          this.$router.push({name: this.$route.name, query: context})
        else
          this.datatable.setContext(context);
      },
      onRemove(subModel) {
        this.$emit("remove",subModel)
      },
      onSubmitFormFilter(e) {
        e.preventDefault()
        this.datatable.applyFilter()
      },
      onAutoFilterSubmit(e,field) {
        this.$emit("inputFilter",{field, value: e})
        if (this.autoFilterSubmit)
          this.datatable.applyFilter()
      },
      onAutoFieldSubmit(model,field) {
        this.$emit("change", { model, field, value: model.get(field) })
        if (this.autoSubmit) {
          const old = model.constructor.findOne(model._id)

          if (model.get(field) !== old.get(field))
            model.save({fields: [field]},
                (err, result) => {
                  this.errorCallback(err, result)
                  if (!err)
                    this.$emit("changed", { model, field, value: model.get(field) })
                }
            )
        }
      },
      onResetFormFilter(e) {
        e.preventDefault()
        this.filterFields.forEach(field => this.datatable.filterModel.set(field))
        this.datatable.setFilter(this.initialFilter)
      }
    },

    unmounted() {
      window.removeEventListener("resize", this.onResize);
      this.datatable.stopSubscription();
    },
    destroyed() {
      // Vue 2 compatibility
      if (typeof this.unmounted === 'function') this.unmounted();
    }
  }


export default _sfc_main;

import { normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, resolveComponent as _resolveComponent, mergeProps as _mergeProps, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createVNode as _createVNode, resolveDirective as _resolveDirective, withCtx as _withCtx, withDirectives as _withDirectives, renderList as _renderList, createSlots as _createSlots, Fragment as _Fragment, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, createElementVNode as _createElementVNode, normalizeClass as _normalizeClass } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { class: "m-2" }
const _hoisted_2 = { key: 1 }
const _hoisted_3 = { key: 0 }
const _hoisted_4 = { key: 0 }
const _hoisted_5 = { key: 1 }
const _hoisted_6 = { key: 0 }
const _hoisted_7 = { class: "mr-2" }
const _hoisted_8 = { key: 0 }
const _hoisted_9 = { key: 1 }
const _hoisted_10 = { role: "row" }
const _hoisted_11 = { key: 0 }
const _hoisted_12 = ["aria-sort", "onClick"]
const _hoisted_13 = {
  key: 1,
  role: "rowgroup"
}
const _hoisted_14 = ["onClick"]
const _hoisted_15 = { key: 1 }
const _hoisted_16 = { key: 0 }
const _hoisted_17 = { key: 1 }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bk_button_icon = _resolveComponent("bk-button-icon")
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_b_button = _resolveComponent("b-button")
  const _component_bk_export_to_xlsx_button = _resolveComponent("bk-export-to-xlsx-button")
  const _component_t = _resolveComponent("t")
  const _component_b_input_group_text = _resolveComponent("b-input-group-text")
  const _component_bk_inner_input = _resolveComponent("bk-inner-input")
  const _component_b_input_group = _resolveComponent("b-input-group")
  const _component_b_form = _resolveComponent("b-form")
  const _component_b_collapse = _resolveComponent("b-collapse")
  const _component_bk_pagination = _resolveComponent("bk-pagination")
  const _component_bk_view_inner = _resolveComponent("bk-view-inner")
  const _component_bk_input = _resolveComponent("bk-input")
  const _component_b_card_text = _resolveComponent("b-card-text")
  const _component_b_card = _resolveComponent("b-card")
  const _component_Draggable = _resolveComponent("Draggable")
  const _component_Container = _resolveComponent("Container")
  const _component_bk_loading = _resolveComponent("bk-loading")
  const _directive_b_toggle = _resolveDirective("b-toggle")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _renderSlot(_ctx.$slots, "header", _normalizeProps(_guardReactiveProps({datatable: $data.datatable, model: $props.model, actions: $props.actions})), () => [
      _renderSlot(_ctx.$slots, "customFrontHeader", _normalizeProps(_guardReactiveProps({datatable: $data.datatable, model: $props.model, actions: $props.actions}))),
      ($props.actions.includes('back'))
        ? (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
            key: 0,
            label: "app.back",
            for: "back"
          }, _ctx.$attrs), null, 16 /* FULL_PROPS */))
        : _createCommentVNode("v-if", true),
      ($props.filterButton && $props.filterFields)
        ? _withDirectives((_openBlock(), _createBlock(_component_b_button, {
            key: 1,
            size: "md",
            class: ""
          }, {
            default: _withCtx(() => [
              _createVNode(_component_b_icon, {
                icon: "filter-circle-fill",
                "aria-hidden": "true"
              })
            ]),
            _: 1 /* STABLE */
          })), [
            [
              _directive_b_toggle,
              void 0,
              void 0,
              { "filter-collapse": true }
            ]
          ])
        : _createCommentVNode("v-if", true),
      ($props.actions.includes('add'))
        ? (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
            key: 2,
            label: "app.add",
            for: "add",
            model: $props.model,
            params: $props.filter,
            fields: $props.modalFields,
            exclude: $props.modalExclude,
            onTag: _cache[0] || (_cache[0] = $event => (_ctx.$emit('tag',$event)))
          }, _ctx.$attrs), _createSlots({ _: 2 /* DYNAMIC */ }, [
            _renderList(_ctx.$scopedSlots, (_, slot) => {
              return {
                name: slot,
                fn: _withCtx((props) => [
                  _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                ])
              }
            })
          ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "params", "fields", "exclude"]))
        : _createCommentVNode("v-if", true),
      ($props.actions.includes('export'))
        ? (_openBlock(), _createBlock(_component_bk_export_to_xlsx_button, _mergeProps({
            key: 3,
            "from-bk-table": "",
            params: {...$props.filter,...$data.datatable.filters},
            onExport: _cache[1] || (_cache[1] = $event => ($data.datatable.exportToCsv()))
          }, _ctx.$attrs), null, 16 /* FULL_PROPS */, ["params"]))
        : _createCommentVNode("v-if", true),
      _createCommentVNode("      <bk-button-icon v-if=\"actions.includes('export')\""),
      _createCommentVNode("                      label=\"app.export\""),
      _createCommentVNode("                      for=\"export\""),
      _createCommentVNode("                      v-bind=\"$attrs\""),
      _createCommentVNode("      />"),
      ($props.actions.includes('import'))
        ? (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
            key: 4,
            label: "app.import.btn.label",
            for: "import"
          }, _ctx.$attrs, {
            model: $props.model,
            "import-file-type": $props.importFileType
          }), null, 16 /* FULL_PROPS */, ["model", "import-file-type"]))
        : _createCommentVNode("v-if", true)
    ]),
    _renderSlot(_ctx.$slots, "customHeader", _normalizeProps(_guardReactiveProps({datatable: $data.datatable, model: $props.model, actions: $props.actions}))),
    _renderSlot(_ctx.$slots, "filterHeader", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,model: $props.model,actions: $props.actions})), () => [
      _renderSlot(_ctx.$slots, "beforeFilter", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,model: $props.model,actions: $props.actions}))),
      ($props.filterButton && $props.filterFields)
        ? (_openBlock(), _createBlock(_component_b_collapse, {
            key: 0,
            id: "filter-collapse"
          }, {
            default: _withCtx(() => [
              ($props.filterFields)
                ? (_openBlock(), _createBlock(_component_b_form, {
                    key: 0,
                    onSubmit: $options.onSubmitFormFilter,
                    onReset: $options.onResetFormFilter,
                    id: "filter-header",
                    inline: "",
                    class: "mt-2 mb-1"
                  }, {
                    default: _withCtx(() => [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($props.filterFields, (field) => {
                        return (_openBlock(), _createBlock(_component_b_input_group, { class: "mb-2 mr-sm-2 mb-sm-0 flex-nowrap max100vw" }, _createSlots({
                          default: _withCtx(() => [
                            _createVNode(_component_bk_inner_input, {
                              model: $data.datatable.filterModel,
                              field: field,
                              for: "filter",
                              "form-field": "filter",
                              buttons: true,
                              "button-variant": "outline-primary",
                              onChange: $event => ($options.onAutoFilterSubmit($event,field)),
                              onInput: $event => ($options.onAutoFilterSubmit($event,field)),
                              onReady: $event => (_ctx.$emit('filterReady',field)),
                              debounce: "250"
                            }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                              _renderList(_ctx.$scopedSlots, (_, slot) => {
                                return {
                                  name: slot,
                                  fn: _withCtx((props) => [
                                    _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                  ])
                                }
                              })
                            ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "onChange", "onInput", "onReady"])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, [
                          (!$props.noFilterLabel)
                            ? {
                                name: "prepend",
                                fn: _withCtx(() => [
                                  _renderSlot(_ctx.$slots, 'prependFilter-'+field, _mergeProps({ ref_for: true }, {datatable: $data.datatable,model: $props.model,field,label:$data.datatable.filterModel.constructor.getLabelKey(field)}), () => [
                                    _renderSlot(_ctx.$slots, "prependFilter", _mergeProps({ ref_for: true }, {datatable: $data.datatable,model: $props.model,field,label: $data.datatable.filterModel.constructor.getLabelKey(field)}), () => [
                                      _createVNode(_component_b_input_group_text, null, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_t, null, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString($data.datatable.filterModel.constructor.getLabelKey(field)), 1 /* TEXT */)
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */)
                                        ]),
                                        _: 2 /* DYNAMIC */
                                      }, 1024 /* DYNAMIC_SLOTS */)
                                    ])
                                  ])
                                ]),
                                key: "0"
                              }
                            : undefined
                        ]), 1024 /* DYNAMIC_SLOTS */))
                      }), 256 /* UNKEYED_FRAGMENT */)),
                      (!$props.noFilterReset)
                        ? (_openBlock(), _createBlock(_component_b_button, {
                            key: 0,
                            type: "reset",
                            variant: "outline-dark",
                            class: "mr-2"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [...(_cache[7] || (_cache[7] = [
                                  _createTextVNode("app.reset", -1 /* CACHED */)
                                ]))]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }))
                        : _createCommentVNode("v-if", true),
                      (!$props.autoFilterSubmit)
                        ? (_openBlock(), _createBlock(_component_b_button, {
                            key: 1,
                            type: "submit",
                            variant: "outline-primary"
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [...(_cache[8] || (_cache[8] = [
                                  _createTextVNode("app.filter", -1 /* CACHED */)
                                ]))]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }))
                        : _createCommentVNode("v-if", true),
                      _renderSlot(_ctx.$slots, "afterFilterButtons", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,model: $props.model})))
                    ]),
                    _: 3 /* FORWARDED */
                  }, 8 /* PROPS */, ["onSubmit", "onReset"]))
                : _createCommentVNode("v-if", true)
            ]),
            _: 3 /* FORWARDED */
          }))
        : (_openBlock(), _createElementBlock("div", _hoisted_2, [
            ($props.filterFields)
              ? (_openBlock(), _createBlock(_component_b_form, {
                  key: 0,
                  onSubmit: $options.onSubmitFormFilter,
                  onReset: $options.onResetFormFilter,
                  id: "filter-header",
                  inline: "",
                  class: "mt-2 mb-1"
                }, {
                  default: _withCtx(() => [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($props.filterFields, (field) => {
                      return (_openBlock(), _createBlock(_component_b_input_group, { class: "mb-2 mr-sm-2 mb-sm-0 flex-nowrap max100vw" }, _createSlots({
                        default: _withCtx(() => [
                          _createVNode(_component_bk_inner_input, {
                            model: $data.datatable.filterModel,
                            field: field,
                            for: "filter",
                            "form-field": "filter",
                            buttons: true,
                            "button-variant": "outline-primary",
                            onChange: $event => ($options.onAutoFilterSubmit($event,field)),
                            onInput: $event => ($options.onAutoFilterSubmit($event,field)),
                            onReady: $event => (_ctx.$emit('filterReady',field)),
                            debounce: "250"
                          }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                            _renderList(_ctx.$scopedSlots, (_, slot) => {
                              return {
                                name: slot,
                                fn: _withCtx((props) => [
                                  _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                ])
                              }
                            })
                          ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "onChange", "onInput", "onReady"])
                        ]),
                        _: 2 /* DYNAMIC */
                      }, [
                        (!$props.noFilterLabel)
                          ? {
                              name: "prepend",
                              fn: _withCtx(() => [
                                _renderSlot(_ctx.$slots, 'prependFilter-'+field, _mergeProps({ ref_for: true }, {datatable: $data.datatable,model: $props.model,field,label:$data.datatable.filterModel.constructor.getLabelKey(field)}), () => [
                                  _renderSlot(_ctx.$slots, "prependFilter", _mergeProps({ ref_for: true }, {datatable: $data.datatable,model: $props.model,field,label: $data.datatable.filterModel.constructor.getLabelKey(field)}), () => [
                                    _createVNode(_component_b_input_group_text, null, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_t, null, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString($data.datatable.filterModel.constructor.getLabelKey(field)), 1 /* TEXT */)
                                          ]),
                                          _: 2 /* DYNAMIC */
                                        }, 1024 /* DYNAMIC_SLOTS */)
                                      ]),
                                      _: 2 /* DYNAMIC */
                                    }, 1024 /* DYNAMIC_SLOTS */)
                                  ])
                                ])
                              ]),
                              key: "0"
                            }
                          : undefined
                      ]), 1024 /* DYNAMIC_SLOTS */))
                    }), 256 /* UNKEYED_FRAGMENT */)),
                    (!$props.noFilterReset)
                      ? (_openBlock(), _createBlock(_component_b_button, {
                          key: 0,
                          type: "reset",
                          variant: "outline-dark",
                          class: "mr-2"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_t, null, {
                              default: _withCtx(() => [...(_cache[9] || (_cache[9] = [
                                _createTextVNode("app.reset", -1 /* CACHED */)
                              ]))]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }))
                      : _createCommentVNode("v-if", true),
                    (!$props.autoFilterSubmit)
                      ? (_openBlock(), _createBlock(_component_b_button, {
                          key: 1,
                          type: "submit",
                          variant: "outline-primary"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_t, null, {
                              default: _withCtx(() => [...(_cache[10] || (_cache[10] = [
                                _createTextVNode("app.filter", -1 /* CACHED */)
                              ]))]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }))
                      : _createCommentVNode("v-if", true),
                    _renderSlot(_ctx.$slots, "afterFilterButtons", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,model: $props.model})))
                  ]),
                  _: 3 /* FORWARDED */
                }, 8 /* PROPS */, ["onSubmit", "onReset"]))
              : _createCommentVNode("v-if", true)
          ]))
    ]),
    ($data.datatable.handler)
      ? (_openBlock(), _createElementBlock("div", _hoisted_3, [
          ($data.datatable.firstReady)
            ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
                _renderSlot(_ctx.$slots, "pagination-top", _normalizeProps(_guardReactiveProps({datatable: $data.datatable, scroll: $props.scroll, perPage: $props.perPage})), () => [
                  (!$props.full && !$props.scroll && _ctx.count!==0 && !$props.noPagination)
                    ? (_openBlock(), _createBlock(_component_bk_pagination, {
                        key: 0,
                        datatable: $data.datatable,
                        scroll: $props.scroll,
                        perPage: $data.datatable.perPage,
                        updateRoute: $props.updateRoute,
                        count: _ctx.count,
                        onPageClick: _cache[2] || (_cache[2] = $event => (_ctx.$emit('page-click',$event)))
                      }, null, 8 /* PROPS */, ["datatable", "scroll", "perPage", "updateRoute", "count"]))
                    : _createCommentVNode("v-if", true)
                ])
              ]))
            : (_openBlock(), _createElementBlock("div", _hoisted_5, [
                _renderSlot(_ctx.$slots, "loading-top", {}, () => [
                  _cache[11] || (_cache[11] = _createElementVNode("div", null, null, -1 /* CACHED */))
                ])
              ]))
        ]))
      : _createCommentVNode("v-if", true),
    _renderSlot(_ctx.$slots, "main", _normalizeProps(_guardReactiveProps({items: $data.items,count: _ctx.count,labeledFields: $options.labeledFields,datatable: $data.datatable, model: $props.model, actions: $props.actions, filterModel: $data.datatable.filterModel})), () => [
      ($options.cardMode)
        ? (_openBlock(), _createElementBlock("div", _hoisted_6, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.items, (model, index) => {
              return (_openBlock(), _createBlock(_component_b_card, {
                class: "mt-2 mb-2",
                onClick: $event => (_ctx.$emit('row-clicked',model)),
                key: model._id
              }, {
                header: _withCtx(() => [
                  _createElementVNode("span", _hoisted_7, [
                    _renderSlot(_ctx.$slots, "cardheader", _mergeProps({ ref_for: true }, {model,index,fields: $options.labeledFields}), () => [
                      _createTextVNode(_toDisplayString(model.defaultName()), 1 /* TEXT */)
                    ])
                  ]),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($props.actions.filter(x=>!['add','back','export','import','custom'].includes(x)), (action) => {
                    return (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
                      for: action,
                      model: model,
                      fields: $props.modalFields,
                      exclude: $props.modalExclude
                    }, { ref_for: true }, _ctx.$attrs, {
                      onRemove: $options.onRemove,
                      onTag: _cache[3] || (_cache[3] = $event => (_ctx.$emit('tag',$event))),
                      class: "float-right"
                    }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                      _renderList(_ctx.$scopedSlots, (_, slot) => {
                        return {
                          name: slot,
                          fn: _withCtx((props) => [
                            _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                          ])
                        }
                      })
                    ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["for", "model", "fields", "exclude", "onRemove"]))
                  }), 256 /* UNKEYED_FRAGMENT */)),
                  _renderSlot(_ctx.$slots, "customActions", _mergeProps({ ref_for: true }, {model, index, cardMode: $options.cardMode}))
                ]),
                default: _withCtx(() => [
                  (_openBlock(), _createBlock(_component_b_card_text, {
                    role: "row",
                    key: model._id
                  }, {
                    default: _withCtx(() => [
                      _renderSlot(_ctx.$slots, "row()", _mergeProps({ ref_for: true }, {model,index,fields: $options.labeledFields, cardMode: $options.cardMode}), () => [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.labeledFields, (cell) => {
                          return (_openBlock(), _createElementBlock("div", {
                            key: cell.key,
                            role: "cell",
                            class: "align-middle"
                          }, [
                            (cell.key!=='buttonActions')
                              ? _renderSlot(_ctx.$slots, 'cell('+cell.key+')', _mergeProps({
                                  key: 0,
                                  ref_for: true
                                }, {model, index, field: cell.key, cardMode: $options.cardMode}), () => [
                                  _renderSlot(_ctx.$slots, "cell()", _mergeProps({ ref_for: true }, {model,index,field: cell.key, cardMode: $options.cardMode}), () => [
                                    (!$data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                      ? (_openBlock(), _createElementBlock("span", _hoisted_8, [
                                          _createVNode(_component_bk_view_inner, {
                                            "no-label": !$props.cardWithLabel,
                                            model: model,
                                            field: cell.key
                                          }, null, 8 /* PROPS */, ["no-label", "model", "field"])
                                        ]))
                                      : ($data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                        ? (_openBlock(), _createElementBlock("span", _hoisted_9, [
                                            ($props.cardWithLabel)
                                              ? (_openBlock(), _createBlock(_component_bk_input, {
                                                  key: 0,
                                                  model: model,
                                                  field: cell.key,
                                                  "form-generic-field": 'cell('+cell.key+')',
                                                  "is-complete-form-generic-field": "",
                                                  "label-cols": "",
                                                  debounce: "500",
                                                  onInput: $event => ($options.onAutoFieldSubmit(model,cell.key))
                                                }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                                                  _renderList(_ctx.$scopedSlots, (_, slot) => {
                                                    return {
                                                      name: slot,
                                                      fn: _withCtx((props) => [
                                                        _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                                      ])
                                                    }
                                                  })
                                                ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-generic-field", "onInput"]))
                                              : (_openBlock(), _createBlock(_component_bk_inner_input, {
                                                  key: 1,
                                                  model: model,
                                                  field: cell.key,
                                                  "form-generic-field": 'cell('+cell.key+')',
                                                  "is-complete-form-generic-field": "",
                                                  debounce: "500",
                                                  onInput: $event => ($options.onAutoFieldSubmit(model,cell.key))
                                                }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                                                  _renderList(_ctx.$scopedSlots, (_, slot) => {
                                                    return {
                                                      name: slot,
                                                      fn: _withCtx((props) => [
                                                        _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                                      ])
                                                    }
                                                  })
                                                ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-generic-field", "onInput"]))
                                          ]))
                                        : _createCommentVNode("v-if", true)
                                  ])
                                ])
                              : _createCommentVNode("v-if", true)
                          ]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ])
                    ]),
                    _: 2 /* DYNAMIC */
                  }, 1024 /* DYNAMIC_SLOTS */)),
                  _renderSlot(_ctx.$slots, "afterRow", _mergeProps({ ref_for: true }, {model, index}))
                ]),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
        : (_openBlock(), _createElementBlock("table", {
            key: 1,
            role: "table",
            class: _normalizeClass('table b-table table-hover mt-3 ' + $props.tblClass)
          }, [
            _renderSlot(_ctx.$slots, "tableHead", _normalizeProps(_guardReactiveProps({items: $data.items,labeledFields: $options.labeledFields,datatable: $data.datatable, model: $props.model, actions: $props.actions})), () => [
              _createElementVNode("thead", null, [
                _createElementVNode("tr", _hoisted_10, [
                  ($props.draggable)
                    ? (_openBlock(), _createElementBlock("th", _hoisted_11, [
                        _createVNode(_component_t, null, {
                          default: _withCtx(() => [...(_cache[12] || (_cache[12] = [
                            _createTextVNode("app.drag.order.title", -1 /* CACHED */)
                          ]))]),
                          _: 1 /* STABLE */
                        })
                      ]))
                    : _createCommentVNode("v-if", true),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.labeledFields, (data) => {
                    return (_openBlock(), _createElementBlock("th", {
                      key: data.key,
                      role: "columnheader",
                      class: _normalizeClass('b-table-sort-icon-left align-middle ' + data.key),
                      "aria-sort": $data.datatable.getAriaSort(data.key),
                      onClick: $event => ($options.onSort(data.key))
                    }, [
                      _renderSlot(_ctx.$slots, 'head('+data.key+')', _mergeProps({ ref_for: true }, {field:data.key}), () => [
                        _renderSlot(_ctx.$slots, "head()", _mergeProps({ ref_for: true }, {field:data.key}), () => [
                          _createVNode(_component_t, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(data.label), 1 /* TEXT */)
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1024 /* DYNAMIC_SLOTS */)
                        ])
                      ])
                    ], 10 /* CLASS, PROPS */, _hoisted_12))
                  }), 128 /* KEYED_FRAGMENT */))
                ])
              ])
            ]),
            ($props.draggable)
              ? (_openBlock(), _createBlock(_component_Container, {
                  key: 0,
                  onDrop: $options.onDrop,
                  "drag-class": "card-ghost bg-warning",
                  "drop-class": "card-ghost-drop",
                  tag: {value: 'tbody', props: {role: 'rowgroup'}},
                  "lock-axis": "y"
                }, {
                  default: _withCtx(() => [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.items, (model, index) => {
                      return (_openBlock(), _createBlock(_component_Draggable, {
                        key: model._id,
                        tag: {value: 'tr', props: {role: 'row'}}
                      }, {
                        default: _withCtx(() => [
                          _renderSlot(_ctx.$slots, "row()", _mergeProps({ ref_for: true }, {model,index,fields: $options.labeledFields, cardMode: $options.cardMode}), () => [
                            _createElementVNode("td", {
                              role: "cell",
                              class: _normalizeClass('align-middle ' + $props.tdClass),
                              style: {"cursor":"pointer"}
                            }, [
                              _createVNode(_component_b_icon, {
                                icon: "arrows-move",
                                "aria-hidden": "true"
                              })
                            ], 2 /* CLASS */),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.labeledFields, (cell) => {
                              return (_openBlock(), _createElementBlock("td", {
                                key: cell.key,
                                role: "cell",
                                class: _normalizeClass('align-middle ' + $props.tdClass)
                              }, [
                                (cell.key==='buttonActions')
                                  ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList($props.actions.filter(x=>!['add','back','export','import','custom'].includes(x)), (action) => {
                                      return (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
                                        for: action,
                                        model: model,
                                        fields: $props.modalFields,
                                        exclude: $props.modalExclude
                                      }, { ref_for: true }, _ctx.$attrs, {
                                        onTag: _cache[4] || (_cache[4] = $event => (_ctx.$emit('tag',$event))),
                                        onRemove: $options.onRemove
                                      }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                                        _renderList(_ctx.$scopedSlots, (_, slot) => {
                                          return {
                                            name: slot,
                                            fn: _withCtx((props) => [
                                              _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                            ])
                                          }
                                        })
                                      ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["for", "model", "fields", "exclude", "onRemove"]))
                                    }), 256 /* UNKEYED_FRAGMENT */))
                                  : _createCommentVNode("v-if", true),
                                (cell.key==='buttonActions')
                                  ? _renderSlot(_ctx.$slots, "customActions", _mergeProps({
                                      key: 1,
                                      ref_for: true
                                    }, {model, index, field: cell.key, cardMode: $options.cardMode}))
                                  : _createCommentVNode("v-if", true),
                                (cell.key!=='buttonActions')
                                  ? _renderSlot(_ctx.$slots, 'cell('+cell.key+')', _mergeProps({
                                      key: 2,
                                      ref_for: true
                                    }, {model, index, field: cell.key, cardMode: $options.cardMode}), () => [
                                      _renderSlot(_ctx.$slots, "cell()", _mergeProps({ ref_for: true }, {model,index,field: cell.key, cardMode: $options.cardMode}), () => [
                                        (!$data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                          ? (_openBlock(), _createBlock(_component_bk_view_inner, {
                                              key: 0,
                                              "no-label": "",
                                              model: model,
                                              field: cell.key
                                            }, null, 8 /* PROPS */, ["model", "field"]))
                                          : ($data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                            ? (_openBlock(), _createBlock(_component_bk_inner_input, {
                                                key: 1,
                                                model: model,
                                                field: cell.key,
                                                "form-generic-field": 'cell('+cell.key+')',
                                                "is-complete-form-generic-field": "",
                                                debounce: "500",
                                                onInput: $event => ($options.onAutoFieldSubmit(model,cell.key))
                                              }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                                                _renderList(_ctx.$scopedSlots, (_, slot) => {
                                                  return {
                                                    name: slot,
                                                    fn: _withCtx((props) => [
                                                      _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                                    ])
                                                  }
                                                })
                                              ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-generic-field", "onInput"]))
                                            : _createCommentVNode("v-if", true)
                                      ])
                                    ])
                                  : _createCommentVNode("v-if", true)
                              ], 2 /* CLASS */))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]),
                          _renderSlot(_ctx.$slots, "afterRow", _mergeProps({ ref_for: true }, {model, index}))
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1024 /* DYNAMIC_SLOTS */))
                    }), 128 /* KEYED_FRAGMENT */)),
                    _renderSlot(_ctx.$slots, "afterAllRows", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,items: $data.items})))
                  ]),
                  _: 3 /* FORWARDED */
                }, 8 /* PROPS */, ["onDrop"]))
              : (_openBlock(), _createElementBlock("tbody", _hoisted_13, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.items, (model, index) => {
                    return (_openBlock(), _createElementBlock(_Fragment, {
                      key: model._id
                    }, [
                      _createElementVNode("tr", {
                        class: _normalizeClass($props.trClass),
                        role: "row",
                        onClick: $event => (_ctx.$emit('row-clicked',model))
                      }, [
                        _renderSlot(_ctx.$slots, "row()", _mergeProps({ ref_for: true }, {model,index,fields: $options.labeledFields}), () => [
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.labeledFields, (cell) => {
                            return (_openBlock(), _createElementBlock("td", {
                              key: cell.key,
                              role: "cell",
                              class: _normalizeClass('align-middle ' + $props.tdClass)
                            }, [
                              (cell.key==='buttonActions')
                                ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList($props.actions.filter(x=>!['add','back','export','import','custom'].includes(x)), (action) => {
                                    return (_openBlock(), _createBlock(_component_bk_button_icon, _mergeProps({
                                      for: action,
                                      model: model,
                                      fields: $props.modalFields,
                                      exclude: $props.modalExclude
                                    }, { ref_for: true }, _ctx.$attrs, {
                                      onTag: _cache[5] || (_cache[5] = $event => (_ctx.$emit('tag',$event))),
                                      onRemove: $options.onRemove
                                    }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                                      _renderList(_ctx.$scopedSlots, (_, slot) => {
                                        return {
                                          name: slot,
                                          fn: _withCtx((props) => [
                                            _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                          ])
                                        }
                                      })
                                    ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["for", "model", "fields", "exclude", "onRemove"]))
                                  }), 256 /* UNKEYED_FRAGMENT */))
                                : _createCommentVNode("v-if", true),
                              (cell.key==='buttonActions')
                                ? _renderSlot(_ctx.$slots, "customActions", _mergeProps({
                                    key: 1,
                                    ref_for: true
                                  }, {model, index, field: cell.key, cardMode: $options.cardMode}))
                                : _createCommentVNode("v-if", true),
                              (cell.key!=='buttonActions')
                                ? _renderSlot(_ctx.$slots, 'cell('+cell.key+')', _mergeProps({
                                    key: 2,
                                    ref_for: true
                                  }, {model, index, field: cell.key}), () => [
                                    _renderSlot(_ctx.$slots, "cell()", _mergeProps({ ref_for: true }, {model,index,field: cell.key}), () => [
                                      (!$data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                        ? (_openBlock(), _createBlock(_component_bk_view_inner, {
                                            key: 0,
                                            "no-label": "",
                                            model: model,
                                            field: cell.key
                                          }, null, 8 /* PROPS */, ["model", "field"]))
                                        : ($data.datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions')
                                          ? (_openBlock(), _createBlock(_component_bk_inner_input, {
                                              key: 1,
                                              model: model,
                                              field: cell.key,
                                              "form-generic-field": 'cell('+cell.key+')',
                                              "is-complete-form-generic-field": "",
                                              debounce: "500",
                                              onInput: $event => ($options.onAutoFieldSubmit(model,cell.key))
                                            }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                                              _renderList(_ctx.$scopedSlots, (_, slot) => {
                                                return {
                                                  name: slot,
                                                  fn: _withCtx((props) => [
                                                    _renderSlot(_ctx.$slots, slot, _mergeProps({ ref_for: true }, props))
                                                  ])
                                                }
                                              })
                                            ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["model", "field", "form-generic-field", "onInput"]))
                                          : _createCommentVNode("v-if", true)
                                    ])
                                  ])
                                : _createCommentVNode("v-if", true)
                            ], 2 /* CLASS */))
                          }), 128 /* KEYED_FRAGMENT */))
                        ])
                      ], 10 /* CLASS, PROPS */, _hoisted_14),
                      _renderSlot(_ctx.$slots, "afterRow", _mergeProps({ ref_for: true }, {model, index}))
                    ], 64 /* STABLE_FRAGMENT */))
                  }), 128 /* KEYED_FRAGMENT */)),
                  _renderSlot(_ctx.$slots, "afterAllRows", _normalizeProps(_guardReactiveProps({datatable: $data.datatable,items: $data.items})))
                ]))
          ], 2 /* CLASS */))
    ]),
    ($data.datatable.handler)
      ? (_openBlock(), _createElementBlock("div", _hoisted_15, [
          ($data.datatable.firstReady)
            ? (_openBlock(), _createElementBlock("div", _hoisted_16, [
                _renderSlot(_ctx.$slots, "pagination-bottom", _normalizeProps(_guardReactiveProps({datatable: $data.datatable, scroll: $props.scroll, perPage: $props.perPage})), () => [
                  (!$props.full && !$props.noPagination)
                    ? (_openBlock(), _createBlock(_component_bk_pagination, {
                        key: 0,
                        datatable: $data.datatable,
                        scroll: $props.scroll,
                        perPage: $data.datatable.perPage,
                        updateRoute: $props.updateRoute,
                        count: _ctx.count,
                        onPageClick: _cache[6] || (_cache[6] = $event => (_ctx.$emit('page-click',$event)))
                      }, _createSlots({ _: 2 /* DYNAMIC */ }, [
                        _renderList(_ctx.$scopedSlots, (_, slot) => {
                          return {
                            name: slot,
                            fn: _withCtx((props) => [
                              _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                            ])
                          }
                        })
                      ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["datatable", "scroll", "perPage", "updateRoute", "count"]))
                    : _createCommentVNode("v-if", true)
                ])
              ]))
            : (_openBlock(), _createElementBlock("div", _hoisted_17, [
                _renderSlot(_ctx.$slots, "loading-bottom", {}, () => [
                  _createVNode(_component_bk_loading, { type: "dots" })
                ])
              ]))
        ]))
      : _createCommentVNode("v-if", true),
    _renderSlot(_ctx.$slots, "footer")
  ]))
}
_sfc_main.render = render;
