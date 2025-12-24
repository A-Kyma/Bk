
import { defineComponent } from "vue/dist/vue.runtime.esm-bundler.js"
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler)

const _sfc_main = defineComponent({
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})


export default _sfc_main;

import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = ["chart-data", "options"]

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("line", {
      "chart-data": _ctx.chartData,
      options: _ctx.options
    }, null, 8 /* PROPS */, _hoisted_1)
  ]))
}
_sfc_main.render = render;
