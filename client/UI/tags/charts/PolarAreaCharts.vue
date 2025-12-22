<template>
  <div>
    <polar-area :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { PolarArea } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'PolarChart',
  components: { PolarArea },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>