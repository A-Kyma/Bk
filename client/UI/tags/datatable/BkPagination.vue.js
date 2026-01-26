
import I18n from "../../../../lib/classes/i18n";
/**
 * This component allows to create a pagination in the datatable
 * used only in the datatable component
 * ex: <bk-pagination :datatable="datatable" :scroll="scroll" :perPage="perPage" :updateRoute="updateRoute" :count="count"/>
 */
const _sfc_main = {
  name: "BkPagination",
  props: {
    // Datatable object (init from datatable.js). can be find in `'%root%/lib/classes'`
    datatable: {
      type: Object,
      required: true
    },
    // number of record per page
    perPage: {
      type: Number,
      required: true
    },
    // When set to true, no page number but just a button below to load more data
    scroll: {
      type: Boolean
    },
    // When set to true, will update the page number in the Route
    updateRoute: {
      type: Boolean
    },
    // Total number of records even those not yet loaded
    count: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
    }
  },
  computed: {
    // @vuese
    // Compute the total count by calling the datatable getCount function
    total() {
      if (!isNaN(this.count)) return this.count
      return this.datatable.getCount()
    }
  },
  meteor: {
    // @vuese
    // check if the scroll button needs to be showed
    viewScrollButton() {
      return (this.datatable.getCount() > this.datatable.getCountLocal())
    },
  },
  data(){
    return { observer: null }
  },
  mounted() {
    // set up an IntersectionObserver to detect visibility of the "see more" link
    const el = this.$refs.seeMoreLink
    if (el && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this.seeMore()
        })
      }, { threshold: 0.5 })
      this.observer.observe(el)
    }
  },
  unmounted() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    // @vuese
    // set a new page in case of scroll
    seeMore(){
      let page = this.datatable.page
      this.datatable.setPage(page + 1)
    },
    // @vuese
    // set a new page in case of pagination
    paginate(page) {
      this.datatable.setPage(page)
      this.$emit("page-click",page)
    }
  }
}


export default _sfc_main;

import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, mergeProps as _mergeProps, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { class: "text-center" }
const _hoisted_3 = { key: 1 }
const _hoisted_4 = { key: 0 }
const _hoisted_5 = { key: 0 }
const _hoisted_6 = { class: "text-center" }
const _hoisted_7 = {
  key: 0,
  class: "btn btn-primary"
}
const _hoisted_8 = { key: 1 }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_bk_loading = _resolveComponent("bk-loading")
  const _component_b_pagination = _resolveComponent("b-pagination")

  return ($props.datatable.getCount()===0)
    ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("p", null, [
            _createVNode(_component_t, null, {
              default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                _createTextVNode("app.noData", -1 /* CACHED */)
              ]))]),
              _: 1 /* STABLE */
            })
          ])
        ])
      ]))
    : (_openBlock(), _createElementBlock("div", _hoisted_3, [
        ($props.scroll)
          ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
              (_ctx.viewScrollButton)
                ? (_openBlock(), _createElementBlock("div", _hoisted_5, [
                    _createElementVNode("div", _hoisted_6, [
                      ($props.datatable.handler.ready())
                        ? (_openBlock(), _createElementBlock("div", _hoisted_7, [
                            _createElementVNode("a", {
                              onClick: _cache[0] || (_cache[0] = $event => ($options.seeMore())),
                              ref: "seeMoreLink"
                            }, [
                              _createVNode(_component_t, { key: "app.seeMore" }, {
                                default: _withCtx(() => [...(_cache[3] || (_cache[3] = [
                                  _createTextVNode("app.seeMore", -1 /* CACHED */)
                                ]))]),
                                _: 1 /* STABLE */
                              })
                            ], 512 /* NEED_PATCH */)
                          ]))
                        : _renderSlot(_ctx.$slots, "loading-bottom", _normalizeProps(_mergeProps({ key: 1 }, {datatable: $props.datatable, scroll: $props.scroll, perPage: $props.perPage})), () => [
                            _createVNode(_component_bk_loading)
                          ])
                    ])
                  ]))
                : _createCommentVNode("v-if", true)
            ]))
          : (_openBlock(), _createElementBlock("div", _hoisted_8, [
              (_openBlock(), _createBlock(_component_b_pagination, {
                key: $props.datatable.page,
                onInput: $options.paginate,
                modelValue: $props.datatable.page,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($props.datatable.page) = $event)),
                "total-rows": $options.total,
                "per-page": $props.perPage,
                class: "mt-1 mb-1"
              }, null, 8 /* PROPS */, ["onInput", "modelValue", "total-rows", "per-page"]))
            ]))
      ]))
}
_sfc_main.render = render;
