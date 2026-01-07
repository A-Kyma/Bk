
import { defineComponent } from "vue/dist/vue.runtime.esm-bundler.js"
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

const _sfc_main = defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_bar = _resolveComponent("bar")

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_bar, {
      "chart-data": _ctx.chartData,
      options: _ctx.options
    }, null, 8 /* PROPS */, ["chart-data", "options"])
  ]))
}
_sfc_main.render = render;
