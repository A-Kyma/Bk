<template>
  <div>
    <doughnut :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'DoughnutChart',
  components: { Doughnut },
  props: {
    chartData: { type: Object, required: true },
    options: { type: Object, default: () => ({}) }
  }
})
</script>