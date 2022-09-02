<template>
  <div class="small m-0 m-auto">
    <div v-if="dataCollection">
      <line-chart v-if="type=='line'" :chart-data="data || dataCollection" :options="dataOptions"></line-chart>
      <pie-chart v-if="type=='pie'" :chart-data="data || dataCollection" :options="dataOptions"></pie-chart>
      <bar-chart v-if="type=='bar'" :chart-data="data || dataCollection" :options="dataOptions"></bar-chart>
      <doughnut-chart v-if="type=='doughnut'" :chart-data="data || dataCollection" :options="dataOptions"></doughnut-chart>
      <polar-chart v-if="type=='polar'" :chart-data="data || dataCollection" :options="dataOptions"></polar-chart>
      <radar-chart v-if="type=='radar'" :chart-data="data || dataCollection" :options="dataOptions"></radar-chart>
    </div>
    <div v-else>
      <t>app.stat.nostat</t>
    </div>
  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { I18n } from "meteor/akyma:bk"
import LineChart from './LineCharts'
import PieChart from './PieCharts'
import BarChart from './BarCharts'
import DoughnutChart from './DoughnutCharts'
import PolarChart from "./PolarAreaCharts";
import RadarChart from './RadarCharts'
// Needed to be able to use Luxon date formatting and chart axis of type time -->
import {Chart} from 'chart.js';
import 'chartjs-adapter-luxon';
// <--

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
      required: false,
    },
    /*
     Meteor Method used in server model class: `'%root%/imports/classes/server'`
     or a classic Meteor Method if model not defined
     */
    method: {
      type: String,
      required: false,
    },
    // json basic params for the query
    queryParam: {
      type: Object,
      required: false,
    },
    data: {
      type: Object,
      default() { return {}},
      required: false,
    },
    options: {
      type: Object,
      default() { return {}},
      required: false,
    }
  },
  data () {
    return {
      dataCollection: this.data,
      dataOptions: this.options
    }
  },
  mounted () {
    // To instantly update language if it is changed
    if (!!this.method)
      this.$autorun(() => {
        this.fillData(I18n.getLanguage())
      })
  },
  methods: {
    // @vuese
    // Used to fill the chart after the method call
    fillData (language) {
      const callback = (err, result) => {
        if (err) {
          this.dataCollection = undefined
          console.log(err)
        } else {
          if (result?.data) {
            this.dataCollection = result.data
            if (result?.options) {
              this.dataOptions = result.options
            }
          } else {
            this.dataCollection = result
          }
        }
      }

      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,this.queryParam,callback)
      } else {
        Meteor.call(this.method,this.queryParam,callback)
      }

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
