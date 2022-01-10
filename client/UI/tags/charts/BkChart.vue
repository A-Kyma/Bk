<template>
  <div class="small">
    <div v-if="datacollection">
      <line-chart v-if="type=='line'" :chart-data="datacollection"></line-chart>
      <pie-chart v-if="type=='pie'" :chart-data="datacollection"></pie-chart>
      <bar-chart v-if="type=='bar'" :chart-data="datacollection"></bar-chart>
      <doughnut-chart v-if="type=='doughnut'" :chart-data="datacollection"></doughnut-chart>
      <polar-chart v-if="type=='polar'" :chart-data="datacollection"></polar-chart>
      <radar-chart v-if="type=='radar'" :chart-data="datacollection"></radar-chart>
    </div>
    <div v-else>
      Pas de stat actuellement.
    </div>
  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import LineChart from './LineCharts'
import PieChart from './PieCharts'
import BarChart from './BarCharts'
import DoughnutChart from './DoughnutCharts'
import PolarChart from "./PolarAreaCharts";
import RadarChart from './RadarCharts'

export default {
  components: {
    LineChart,PieChart,BarChart,DoughnutChart,PolarChart,RadarChart
  },
  props: {
    type: String,
    model: String,
    method: String,
    queryParam: Object
  },
  data () {
    return {
      datacollection: {}
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      let methodClass = Class.getModel(this.model)
      methodClass.callMethod(this.method,this.queryParam,(err, result) => {
        if (err){
          this.datacollection = undefined
          console.log(err)
        } else {
          this.datacollection = result
        }
      })
    }
  }
}
</script>

<style>
.small {
  max-width: 250px;
  margin: 20px;
}
</style>
