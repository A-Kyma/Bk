<template>
  <div>
    <line :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
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

export default defineComponent({
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>
