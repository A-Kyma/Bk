<template>
  <div class="small">
    <div v-if="datacollection">
      <line-chart v-if="type=='line'" :chart-data="datacollection" :options="options"></line-chart>
      <pie-chart v-if="type=='pie'" :chart-data="datacollection" :options="options"></pie-chart>
      <bar-chart v-if="type=='bar'" :chart-data="datacollection" :options="options"></bar-chart>
      <doughnut-chart v-if="type=='doughnut'" :chart-data="datacollection" :options="options"></doughnut-chart>
      <polar-chart v-if="type=='polar'" :chart-data="datacollection" :options="options"></polar-chart>
      <radar-chart v-if="type=='radar'" :chart-data="datacollection" :options="options"></radar-chart>
    </div>
    <div v-else>
      <t>app.stat.nostat</t>
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
      datacollection: {},
      options: {}
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
          if (result?.data){
            this.datacollection = result.data
            if (result?.options){
              this.options = result.options
            }
          } else {
            this.datacollection = result
          }
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
