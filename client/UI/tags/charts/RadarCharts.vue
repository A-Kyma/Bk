<template>
  <div>
    <radar :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

export default defineComponent({
  name: 'RadarChart',
  components: { Radar },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>