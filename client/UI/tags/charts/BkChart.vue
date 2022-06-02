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
import { I18n } from "meteor/a-kyma:bk"
import LineChart from './LineCharts'
import PieChart from './PieCharts'
import BarChart from './BarCharts'
import DoughnutChart from './DoughnutCharts'
import PolarChart from "./PolarAreaCharts";
import RadarChart from './RadarCharts'

/**
 * This component allows to create a chart based on https://vue-chartjs.org/
 * ex: <bk-chart type="pie" model="ClubMember" method="getResult" :query-param='getParamMember(model)'/>
 */
export default {
  name: "BkChart",
  components: {
    LineChart,PieChart,BarChart,DoughnutChart,PolarChart,RadarChart
  },
  props: {
    // type of possible Charts
    type: {
      //`Possible String` line,pie,bar,doughnut,polar,radar
      type: String,
      required: true,
    },
    // Model name: models can be find in `'%root%/imports/classes'`
    model: {
      type: String,
      required: true,
    },
    // Meteor Method used in server model class: `'%root%/imports/classes/server'`
    method: {
      type: String,
      required: true,
    },
    // json basic params for the query
    queryParam: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      datacollection: {},
      options: {}
    }
  },
  mounted () {
    // To instantly update language if it is changed
    this.$autorun(() => {
      this.fillData(I18n.getLanguage())
    })

  },
  methods: {
    // @vuese
    // Used to fill the chart after the method call
    fillData (language) {
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
