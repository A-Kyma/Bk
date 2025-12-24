
import {Class} from "meteor/akyma:astronomy"

const _sfc_main = {
  name: "BkPage",
  props: {
    // Model Class or String to use for this page
    model: [Class,String],
    // Main model subscription
    subscription: String,
    // Subscription to wait before showing the content
    waitSubscription: [String,Array],
    /***
     * Parameters used for the subscription of the main model
     * if undefined, takes {id: this.$route.params.id}
     */
    params: {
      type: [Array, String, Object]
    },
    // Query is used to instanciate the New model
    query: {
      type: Object,
      default() { return {} }
    },
    // Type of waiting icons for bk-loading
    type: {
      type: String,
      default: "dots"
    }
  },
  data() {
    return {
      firstSubReady: false
    }
  },
  mounted() {
    if (this.waitSubscription) {
      if (Array.isArray(this.waitSubscription)) {
        this.waitSubscription.forEach(subscription => {
          this.$subscribe(subscription,[])
        })
      } else {
        this.$subscribe(this.waitSubscription,[])
      }
    }

    if (!!this.subscription && !!this.params) {
      if (Array.isArray(this.params))
        this.$subscribe(this.subscription,this.params)

      else if (typeof this.params === "string" || typeof this.params === "object")
        this.$subscribe(this.subscription,[this.params])
    }

    else if (!!this.subscription
        && this.$route.params["for"] !== "new"
        && !!this.$route.params.id)
      this.$subscribe(this.subscription,[this.$route.params.id])

    else
      this.firstSubReady = true
  },
  watch: {
    ready(newValue, oldValue) {
      if (newValue !== oldValue && newValue)
        this.$emit("ready",this.findModel)
    }
  },
  computed: {
    waitReady() {
      if (!this.waitSubscription) return true
      if (Array.isArray(this.waitSubscription)) {
        let ready = true
        this.waitSubscription.forEach(subscription => {
          if (ready) ready = this.$subReady[subscription]
        })
        return ready
      } else {
        return this.$subReady[this.waitSubscription]
      }
    },
    ready() {
      if (!this.waitReady) return false
      return !this.subscription
          || this.firstSubReady
          || this.$subReady[this.subscription]
    },
    findModel() {
      this.firstSubReady = true
      if (!this.model) return

      let modelClass

      if (typeof this.model === "string")
        modelClass = Class.get(this.model)
      else
        modelClass = this.model.constructor

      if (!this.subscription)
        return this.model

      else {
        if (this.$route.params["for"] === "new")
          return new modelClass({...this.$route.query,...this.query}, {cast: true})

        return this.$autorun(() =>
            modelClass.findOne(this.$route.params.id)
        )
      }
    },
  },
}


export default _sfc_main;

import { renderSlot as _renderSlot, resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { key: 1 }

function render(_ctx, _cache) {
  const _component_bk_loading = _resolveComponent("bk-loading")

  return (!_ctx.ready)
    ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _renderSlot(_ctx.$slots, "title"),
        _createVNode(_component_bk_loading, { type: _ctx.type }, null, 8 /* PROPS */, ["type"])
      ]))
    : (_openBlock(), _createElementBlock("div", _hoisted_2, [
        _renderSlot(_ctx.$slots, "title"),
        _renderSlot(_ctx.$slots, "default", _normalizeProps(_guardReactiveProps({model: _ctx.findModel, params: _ctx.$route.params, ready: _ctx.ready})))
      ]))
}
_sfc_main.render = render;
