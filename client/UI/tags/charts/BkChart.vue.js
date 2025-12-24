
import { Class } from "meteor/akyma:astronomy"
import { I18n, DateTime } from "meteor/akyma:bk"
import LineChart from "./LineCharts.vue.js"
import PieChart from "./PieCharts.vue.js"
import BarChart from "./BarCharts.vue.js"
import DoughnutChart from "./DoughnutCharts.vue.js"
import PolarChart from "./PolarAreaCharts.vue.js";
import RadarChart from "./RadarCharts.vue.js"
import BulletChart from "./BulletCharts.vue.js"
// Needed to be able to use Luxon date formatting and chart axis of type time -->
import {Chart} from 'chart.js';
import 'chartjs-adapter-luxon';
// <--

/**
 * This component allows to create a chart based on https://vue-chartjs.org/
 * ex: <bk-chart type="pie" model="ClubMember" method="getResult" :query-param='getParamMember(model)'/>
 */
const _sfc_main = {
  name: "BkChart",
  components: {
    LineChart,PieChart,BarChart,DoughnutChart,PolarChart,RadarChart,BulletChart
  },
  props: {
    // type of possible Charts
    type: {
      //`Possible String` line,pie,bar,doughnut,polar,radar,bullet
      type: String,
      required: true,
    },
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
      required: false,
    },
    // json basic params for the query
    queryParam: {
      type: Object,
      required: false,
    },
    data: {
      type: Object,
      default() { return {}},
      required: false,
    },
    options: {
      type: Object,
      default() { return {}},
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
      dataCollection: this.data,
      dataOptions: this.options,
    }
  },
  computed: {
    sizeClass() {
      return "BkChart-"+this.size + " m-0 m-auto"
    },
    hasSelect(){
      return (this.queryParam?.select !== undefined)? true : false
    },
    selectableItems(){
      if (this.queryParam !== undefined){
        return this.queryParam.select
      }
      return []
    }
  },
  mounted () {
    // To instantly update language if it is changed
    if (!!this.method)
      this.$autorun(() => {
        this.fillData(I18n.getLanguage())
      })
  },
  methods: {
    updateDataCollection(e){
      this.queryParam.selected = e
      if (this.queryParam.method)
        this.fillData(I18n.getLanguage())
    },
    // @vuese
    // Used to fill the chart after the method call
    fillData (language) {
      const callback = (err, result) => {
        if (err) {
          this.dataCollection = undefined
          console.log(err)
        } else {
          if (result?.data) {
            this.dataCollection = result.data
            if (result?.options) {
              this.dataOptions = result.options
            }
          } else {
            this.dataCollection = result
          }
        }
      }

      const queryParam = {...this.queryParam, locale: language, timeZone: DateTime.getTimeZone()}
      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,this.queryParam,callback)
      } else {
        if (this.method === undefined && this.queryParam.method ){
          Meteor.call(this.queryParam.method,this.queryParam,callback)
        }else{
          Meteor.call(this.method,this.queryParam,callback)
        }
      }

    }
  }
}


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createBlock as _createBlock, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { key: 1 }
const _hoisted_3 = { key: 2 }

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_b_form_select_option = _resolveComponent("b-form-select-option")
  const _component_b_form_select = _resolveComponent("b-form-select")
  const _component_line_chart = _resolveComponent("line-chart")
  const _component_pie_chart = _resolveComponent("pie-chart")
  const _component_bar_chart = _resolveComponent("bar-chart")
  const _component_doughnut_chart = _resolveComponent("doughnut-chart")
  const _component_polar_chart = _resolveComponent("polar-chart")
  const _component_radar_chart = _resolveComponent("radar-chart")
  const _component_bullet_chart = _resolveComponent("bullet-chart")

  return (_openBlock(), _createElementBlock("div", {
    class: _normalizeClass(_ctx.sizeClass)
  }, [
    (_ctx.hasSelect)
      ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
          _createVNode(_component_b_form_select, {
            onChange: _ctx.updateDataCollection,
            modelValue: _ctx.selected,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.selected) = $event)),
            class: "mb-3"
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.selectableItems, (item) => {
                return (_openBlock(), _createBlock(_component_b_form_select_option, {
                  value: item.value
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(item.label), 1 /* TEXT */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1024 /* DYNAMIC_SLOTS */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value"]))
              }), 256 /* UNKEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["onChange", "modelValue"])
        ]))
      : _createCommentVNode("v-if", true),
    (_ctx.dataCollection)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [
          (_ctx.type=='line')
            ? (_openBlock(), _createBlock(_component_line_chart, {
                key: 0,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='pie')
            ? (_openBlock(), _createBlock(_component_pie_chart, {
                key: 1,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='bar')
            ? (_openBlock(), _createBlock(_component_bar_chart, {
                key: 2,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='doughnut')
            ? (_openBlock(), _createBlock(_component_doughnut_chart, {
                key: 3,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='polar')
            ? (_openBlock(), _createBlock(_component_polar_chart, {
                key: 4,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='radar')
            ? (_openBlock(), _createBlock(_component_radar_chart, {
                key: 5,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection,
                options: _ctx.dataOptions
              }, null, 8 /* PROPS */, ["class", "chart-data", "options"]))
            : _createCommentVNode("v-if", true),
          (_ctx.type=='bullet')
            ? (_openBlock(), _createBlock(_component_bullet_chart, {
                key: 6,
                class: _normalizeClass(_ctx.height),
                "chart-data": _ctx.data || _ctx.dataCollection
              }, null, 8 /* PROPS */, ["class", "chart-data"]))
            : _createCommentVNode("v-if", true)
        ]))
      : (_openBlock(), _createElementBlock("div", _hoisted_3, [
          _createVNode(_component_t, null, {
            default: _withCtx(() => [...(_cache[1] || (_cache[1] = [
              _createTextVNode("app.stat.nostat", -1 /* CACHED */)
            ]))]),
            _: 1 /* STABLE */
          })
        ]))
  ], 2 /* CLASS */))
}
_sfc_main.render = render;
