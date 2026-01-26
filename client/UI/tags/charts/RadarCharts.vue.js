
import { defineComponent } from "vue/dist/vue.runtime.esm-bundler.js"
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

const _sfc_main = defineComponent({
  name: 'RadarChart',
  components: { Radar },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_radar = _resolveComponent("radar")

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_radar, {
      "chart-data": _ctx.chartData,
      options: _ctx.options
    }, null, 8 /* PROPS */, ["chart-data", "options"])
  ]))
}
_sfc_main.render = render;
