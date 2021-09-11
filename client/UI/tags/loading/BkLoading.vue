<template>
  <div v-if="type==='dots'">
    <div class="text-center">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </div>
  </div>
  <div v-else-if="type==='loading'">
    <div class="text-center">LOADING</div>
    <div class="text-center">
      <b-spinner variant="dark" type="grow" label="Spinning"></b-spinner>
      <b-spinner variant="warning" type="grow" label="Spinning"></b-spinner>
      <b-spinner variant="danger" type="grow" label="Spinning"></b-spinner>
    </div>
  </div>
  <div v-else>
    <div class="text-center">
      <b-icon icon="circle-fill" animation="throb" font-scale="4"></b-icon>
    </div>
  </div>

</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkLoading",
  props: {
    type: String,
    variant: String
  }
}
</script>

<style scoped>

</style>