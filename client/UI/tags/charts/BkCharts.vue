<template>
  <b-row v-if="chartsData && chartsData.length > 0" align-content="center">
    <template v-for="chartData in chartsData">
      <slot v-bind="chartData">
        <b-col :class="size">
          <b-card class="text-center" body-class="p-2 p-sm-3 p-m-5">
            <template #header>
              <t :options="translationOptions">{{chartData.title}}</t>
            </template>
            <b-card-text>
              <slot :name="'chart-'+chartData.type" v-bind="chartData">
                <bk-chart
                    :type="chartData.type"
                    :data="chartData.data"
                    :options="chartData.options"
                    :query-param="queryParam"
                    :size="size"
                    :height="height"
                />
              </slot>
            </b-card-text>
          </b-card>
        </b-col>
      </slot>
    </template>
  </b-row>
  <div v-else class="ml-3">
    <t>app.stat.nostat</t>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import { I18n, DateTime } from "meteor/akyma:bk"

export default {
  name: "BkCharts",
  props: {
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
      required: true,
    },
    // json basic params for the query
    queryParam: {
      type: Object,
      required: true,
    },
    translationOptions: {
      type: Object,
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
      chartsData: [],
      ready: false,
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
    fillData(language) {
      const callback = (err, result) => {
        if (err) {
          this.chartsData = undefined
          console.log(err)
        } else {
          this.chartsData = result
        }
        this.ready=true
        this.$emit("ready")
      }

      const queryParam = {...this.queryParam, locale: language, timeZone: DateTime.getTimeZone()}
      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,queryParam,callback)
      } else {
        console.log('call from BKCharts')
        console.log(this.method)
        console.log(queryParam)
        Meteor.call(this.method,queryParam,callback)
        //Meteor.apply(this.method,[queryParam],callback)
      }

    }
  }
}
</script>

<style scoped>
.card{
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%)!important;
  margin-bottom: 10px!important;
}
.col.sm{
  padding-bottom: 5px!important;
  min-width: 300px;
  max-width: 510px;
}

.col.md{
  padding-bottom: 5px!important;
  /*min-width: 400px;*/
  max-width: 600px;
}

.col.lg{
  padding-bottom: 5px!important;
  /*min-width: 500px;*/
  width: 90%;
}
</style>