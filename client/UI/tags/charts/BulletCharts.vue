<template>
  <div>
    <div class="mb-2">
      <template v-for="label in chartData.labels">
        <div class="chartLabels" :style="'background:'+ label.variant"/> <span class="mr-2" style="font-size: 14px">{{label.title}}</span>
      </template>
    </div>
    <b-card>
      <div style="font-size: 2rem;">
        <template v-for="item in chartData.data">

          <b-icon v-if="item.tooltip" @click="show = !show" :id="'tooltip-' + item._id" :icon="item.icon" :style="'background:'+getVariant(item)" class="rounded-circle p-2" variant="white"></b-icon>
          <b-icon v-else :icon="item.icon" :style="'background:'+getVariant(item)" class="rounded-circle p-2" variant="white"></b-icon>

          <b-tooltip v-if="item.tooltip" :show.sync="show" :target="'tooltip-' + item._id" placement="top">
            <span><t>{{item.tooltip}}</t></span>
          </b-tooltip>

        </template>
      </div>
    </b-card>
  </div>
</template>

<script>
/**
 * This component allows to create a list of horizontal icons
 * The aggregate behind needs the below returned json
 *     chartDetails.data = {
 *       labels: labels,
 *       data: res
 *   }
 *   where labels contains: title, variant (rgba color) and icon
 *   res contains icon label and not mandatory tooltip
 */
export default {
  name: "BulletChart",
  data() {
    return {
    }
  },
  props: {
    chartData: {
      //Object contains labels {title, variant (rgba color) and icon[string]} and data result: {icon[string] and not mandatory tooltip}
      type: Object
    },
  },
  methods: {
    getVariant(item){
      let res = item.icon
      let labels = this.chartData.labels
      let label = labels.filter(i => i.icon === res)
      return label[0].variant
    },
  }
}
</script>

<style scoped>
  .accordion .card:last-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .card-body{
    padding: 0px;
  }
  .chartLabels{
    display: inline-block;
    height: 12px;
    width: 40px;
  }
</style>