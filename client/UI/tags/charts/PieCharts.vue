<template>
  <div>
    <pie :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'PieChart',
  components: { Pie },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>
