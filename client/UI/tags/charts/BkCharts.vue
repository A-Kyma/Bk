<template>
  <b-row v-if="chartsData && chartsData.length > 0" align-content="center">
    <template v-for="chartData in chartsData">
      <slot v-bind="chartData">
        <b-col>
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
import { I18n } from "meteor/akyma:bk"

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
    }
  },
  data () {
    return {
      chartsData: [],
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
      }

      const queryParam = {...this.queryParam, locale: language}
      if (this.model) {
        let methodClass = Class.getModel(this.model)
        methodClass.callMethod(this.method,queryParam,callback)
      } else {
        Meteor.call(this.method,queryParam,callback)
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
.col{
  padding-bottom: 5px!important;
  min-width: 300px;
  max-width: 510px;
}
</style>