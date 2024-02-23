<template>
  <div :class="sizeClass">
    <div v-if="hasSelect">
      <b-form-select @change="updateDataCollection" v-model="selected" class="mb-3">
        <b-form-select-option v-for="item in selectableItems" :value="item.value"><t>{{item.label}}</t></b-form-select-option>
      </b-form-select>
    </div>
    <div v-if="dataCollection">
      <line-chart v-if="type=='line'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></line-chart>
      <pie-chart v-if="type=='pie'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></pie-chart>
      <bar-chart v-if="type=='bar'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></bar-chart>
      <doughnut-chart v-if="type=='doughnut'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></doughnut-chart>
      <polar-chart v-if="type=='polar'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></polar-chart>
      <radar-chart v-if="type=='radar'" :class="height" :chart-data="data || dataCollection" :options="dataOptions"></radar-chart>
      <bullet-chart v-if="type=='bullet'" :class="height" :chart-data="data || dataCollection"></bullet-chart>
    </div>
    <div v-else>
      <t>app.stat.nostat</t>
    </div>
  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { I18n, DateTime } from "meteor/akyma:bk"
import LineChart from './LineCharts'
import PieChart from './PieCharts'
import BarChart from './BarCharts'
import DoughnutChart from './DoughnutCharts'
import PolarChart from "./PolarAreaCharts";
import RadarChart from './RadarCharts'
import BulletChart from './BulletCharts'
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
    LineChart,PieChart,BarChart,DoughnutChart,PolarChart,RadarChart,BulletChart
  },
  props: {
    // type of possible Charts
    type: {
      //`Possible String` line,pie,bar,doughnut,polar,radar,bullet
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
    },
    size: {
      type: String,
      default: "sm",
      validator(value) {
        return ["sm","md","lg"].includes(value)
      }
    },
    // must be used with maintainAspectRatio: false as chartDetails.options
    // https://www.chartjs.org/docs/latest/configuration/responsive.html
    height:{
      type: String,
      default: "",
    }
  },
  data () {
    return {
      dataCollection: this.data,
      dataOptions: this.options,
    }
  },
  computed: {
    sizeClass() {
      return "BkChart-"+this.size + " m-0 m-auto"
    },
    hasSelect(){
      return (this.queryParam?.select !== undefined)? true : false
    },
    selectableItems(){
      if (this.queryParam !== undefined){
        return this.queryParam.select
      }
      return []
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
    updateDataCollection(e){
      this.queryParam.selected = e
      if (this.queryParam.method)
        this.fillData(I18n.getLanguage())
    },
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

      const queryParam = {...this.queryParam, locale: language, timeZone: DateTime.getTimeZone()}
      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,this.queryParam,callback)
      } else {
        if (this.method === undefined && this.queryParam.method ){
          Meteor.call(this.queryParam.method,this.queryParam,callback)
        }else{
          Meteor.call(this.method,this.queryParam,callback)
        }
      }

    }
  }
}
</script>

<style>
.BkChart-sm {
  max-width: 250px;
  margin: 20px;
}
.BkChart-md {
  max-width: 500px;
  margin: 20px;
}
.BkChart-lg {
  max-width: 95%;
  margin: 20px;
}
</style>
