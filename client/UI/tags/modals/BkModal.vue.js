
import {Class} from "meteor/akyma:astronomy"

const _sfc_main = {
  name: "BkModal",
  props: {
    id: String,
    model: Class,
    field: String,
    title: {
      type: String,
      default: "app.chooseType"
    },
    subscription: String,
  },
  data() {
    return {
      firstSubReady: false
    }
  },
  computed: {
    findModel() {
      if (!this.subscription)
        return this.model
      else {
        this.firstSubReady = true
        return this.$autorun(() =>
            this.model.constructor.findOne(this.model._id)
        )
      }
    },
  },
  methods: {
    onOk(e) {
      this.$emit("ok",e);
    },
    onShow() {
      this.$emit('show')
      if (!!this.subscription)
        this.$subscribe(this.subscription,[this.model._id])
    },
    show() {
      // bootstrap-vue-3 uses component instance methods; fallback to $bvModal for Vue2
      if (this.$refs.modal && typeof this.$refs.modal.show === 'function') {
        this.$refs.modal.show()
        return
      }
      if (this.$bvModal && typeof this.$bvModal.show === 'function') {
        this.$bvModal.show(this.id)
      }
    },
    hide() {
      if (this.$refs.modal && typeof this.$refs.modal.hide === 'function') {
        this.$refs.modal.hide()
        return
      }
      if (this.$bvModal && typeof this.$bvModal.hide === 'function') {
        this.$bvModal.hide(this.id)
      }
    }
  },
}


export default _sfc_main;

import { renderSlot as _renderSlot, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, mergeProps as _mergeProps, renderList as _renderList, createSlots as _createSlots } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_bk_loading = _resolveComponent("bk-loading")
  const _component_b_modal = _resolveComponent("b-modal")

  return (_openBlock(), _createBlock(_component_b_modal, _mergeProps({
    ref: "modal",
    id: _ctx.id,
    onOk: _ctx.onOk,
    onShow: _ctx.onShow
  }, _ctx.$attrs, {
    onShown: _cache[0] || (_cache[0] = $event => (_ctx.$emit('shown'))),
    onHide: _cache[1] || (_cache[1] = $event => (_ctx.$emit('hide')))
  }), _createSlots({
    "modal-title": _withCtx(() => [
      _renderSlot(_ctx.$slots, "title", {}, () => [
        _createVNode(_component_t, null, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(_ctx.title), 1 /* TEXT */)
          ]),
          _: 1 /* STABLE */
        })
      ])
    ]),
    "modal-ok": _withCtx(() => [
      _renderSlot(_ctx.$slots, "ok", {}, () => [
        _createVNode(_component_t, null, {
          default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
            _createTextVNode("app.ok", -1 /* CACHED */)
          ]))]),
          _: 1 /* STABLE */
        })
      ])
    ]),
    "modal-cancel": _withCtx(() => [
      _createVNode(_component_t, null, {
        default: _withCtx(() => [...(_cache[3] || (_cache[3] = [
          _createTextVNode("app.cancel", -1 /* CACHED */)
        ]))]),
        _: 1 /* STABLE */
      })
    ]),
    default: _withCtx((props) => [
      (!!_ctx.subscription && !_ctx.$subReady[_ctx.subscription]  && !_ctx.firstSubReady)
        ? (_openBlock(), _createBlock(_component_bk_loading, {
            key: 0,
            type: "dots"
          }))
        : _renderSlot(_ctx.$slots, "default", _normalizeProps(_mergeProps({ key: 1 }, {model: _ctx.findModel})))
    ]),
    _: 2 /* DYNAMIC */
  }, [
    _renderList(_ctx.$scopedSlots, (_, slot) => {
      return {
        name: slot,
        fn: _withCtx((props) => [
          _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
        ])
      }
    })
  ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["id", "onOk", "onShow"]))
}
_sfc_main.render = render;
