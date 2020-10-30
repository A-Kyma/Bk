<template>
  <span>{{value}}</span>
</template>

<script>
import Class from "meteor/jagi:astronomy"

export default {
    name: "BkViewClean",
    props: {
      model: Class,
      field: String,
    },
  meteor: {
    value() {
      return this.model.getValue(this.field)
    }
  },
  }
</script>

<style scoped>

</style>