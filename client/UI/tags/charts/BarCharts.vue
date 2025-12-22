<template>
  <div>
    <bar :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>
