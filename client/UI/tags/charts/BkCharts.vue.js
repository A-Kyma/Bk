
import {Class} from "meteor/akyma:astronomy"
import { I18n, DateTime } from "meteor/akyma:bk"

const _sfc_main = {
  name: "BkCharts",
  props: {
    // Model name: models can be find in `'%root%/imports/classes'`
    model: {
      type: String,
      required: false,
    },
    /*
     Meteor Method used in server model class: `'%root%/imports/classes/server'`
     or a classic Meteor Method if model not defined
     */
    method: {
      type: String,
      required: true,
    },
    // json basic params for the query
    queryParam: {
      type: Object,
      required: true,
    },
    translationOptions: {
      type: Object,
      required: false,
    },
    size: {
      type: String,
      default: "sm",
      validator(value) {
        return ["sm","md","lg"].includes(value)
      }
    },
    // must be used with maintainAspectRatio: false as chartDetails.options
    // https://www.chartjs.org/docs/latest/configuration/responsive.html
    height:{
      type: String,
      default: "",
    }
  },
  data () {
    return {
      chartsData: [],
      ready: false,
    }
  },
  mounted () {
    // To instantly update language if it is changed
    this.$autorun(() => {
      this.fillData(I18n.getLanguage())
    })
  },
  methods: {
    // @vuese
    // Used to fill the chart after the method call
    fillData(language) {
      const callback = (err, result) => {
        if (err) {
          this.chartsData = undefined
          console.log(err)
        } else {
          this.chartsData = result
        }
        this.ready=true
        this.$emit("ready")
      }

      const queryParam = {...this.queryParam, locale: language, timeZone: DateTime.getTimeZone()}
      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,queryParam,callback)
      } else {
        Meteor.call(this.method,queryParam,callback)
      }

    }
  }
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, mergeProps as _mergeProps, renderSlot as _renderSlot, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, normalizeClass as _normalizeClass, createBlock as _createBlock, createCommentVNode as _createCommentVNode } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  key: 1,
  class: "ml-3"
}

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_bk_chart = _resolveComponent("bk-chart")
  const _component_b_card_text = _resolveComponent("b-card-text")
  const _component_b_card = _resolveComponent("b-card")
  const _component_b_col = _resolveComponent("b-col")
  const _component_b_row = _resolveComponent("b-row")

  return ($data.chartsData && $data.chartsData.length > 0)
    ? (_openBlock(), _createBlock(_component_b_row, {
        key: 0,
        "align-content": "center"
      }, {
        default: _withCtx(() => [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.chartsData, (chartData) => {
            return _renderSlot(_ctx.$slots, "default", _mergeProps({ ref_for: true }, chartData), () => [
              _createVNode(_component_b_col, {
                class: _normalizeClass($props.size)
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_b_card, {
                    class: "text-center",
                    "body-class": "p-2 p-sm-3 p-m-5"
                  }, {
                    header: _withCtx(() => [
                      _createVNode(_component_t, { options: $props.translationOptions }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(chartData.title), 1 /* TEXT */)
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["options"])
                    ]),
                    default: _withCtx(() => [
                      _createVNode(_component_b_card_text, null, {
                        default: _withCtx(() => [
                          _renderSlot(_ctx.$slots, 'chart-'+chartData.type, _mergeProps({ ref_for: true }, chartData), () => [
                            _createVNode(_component_bk_chart, {
                              type: chartData.type,
                              data: chartData.data,
                              options: chartData.options,
                              "query-param": $props.queryParam,
                              size: $props.size,
                              height: $props.height
                            }, null, 8 /* PROPS */, ["type", "data", "options", "query-param", "size", "height"])
                          ])
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1024 /* DYNAMIC_SLOTS */)
                    ]),
                    _: 2 /* DYNAMIC */
                  }, 1024 /* DYNAMIC_SLOTS */)
                ]),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["class"])
            ])
          }), 256 /* UNKEYED_FRAGMENT */))
        ]),
        _: 3 /* FORWARDED */
      }))
    : (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _createVNode(_component_t, null, {
          default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
            _createTextVNode("app.stat.nostat", -1 /* CACHED */)
          ]))]),
          _: 1 /* STABLE */
        })
      ]))
}
_sfc_main.render = render;
