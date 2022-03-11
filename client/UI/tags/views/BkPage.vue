<template>
  <div v-if="!ready">
    <bk-loading :type="type"/>
  </div>
  <div v-else>
    <slot v-bind="{model: findModel}"></slot>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkPage",
  props: {
    model: [Class,String],
    subscription: String,
    waitSubscription: [String,Array],
    type: {
      type: String,
      default: "dots"
    }
  },
  data() {
    return {
      params: this.$route.params,
      query: this.$route.query,
      firstSubReady: false
    }
  },
  mounted() {
    if (this.waitSubscription) {
      if (Array.isArray(this.waitSubscription)) {
        this.waitSubscription.forEach(subscription => {
          this.$subscribe(subscription,[])
        })
      } else {
        this.$subscribe(this.waitSubscription,[])
      }
    }
    if (!!this.subscription
        && this.$route.params["for"] !== "new"
        && !!this.$route.params.id)
      this.$subscribe(this.subscription,[this.$route.params.id]);
    else
      this.firstSubReady = true
  },
  computed: {
    waitReady() {
      if (!this.waitSubscription) return true
      if (Array.isArray(this.waitSubscription)) {
        let ready = true
        this.waitSubscription.forEach(subscription => {
          if (ready) ready = this.$subReady[subscription]
        })
        return ready
      } else {
        return this.$subReady[this.waitSubscription]
      }
    },
    ready() {
      if (!this.waitReady) return false
      return !this.subscription
          || this.firstSubReady
          || this.$subReady[this.subscription]
    },
    findModel() {
      this.firstSubReady = true
      if (!this.model) return

      let modelClass

      if (typeof this.model === "string")
        modelClass = Class.get(this.model)
      else
        modelClass = this.model.constructor

      if (!this.subscription)
        return this.model

      else {
        if (this.$route.params["for"] === "new")
          return new modelClass(this.$route.query, {cast: true})

        return this.$autorun(() =>
            modelClass.findOne(this.$route.params.id)
        )
      }
    },
  },
}
</script>

<style scoped>

</style>