<template>
  <slot>

  </slot>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkCharts",
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
      dataCollection: {},
      options: {}
    }
  },

}
</script>

<style scoped>

</style>