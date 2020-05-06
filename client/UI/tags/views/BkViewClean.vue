<template>
    <bk-inner-input v-bind="$props" for="view"/>
</template>

<script>
  import Class from "meteor/jagi:astronomy"
  import {Bk} from "../../../../lib/lib.js"

  export default {
    name: "BkViewClean",
    props: {
      model: Class,
      field: String,
    },
  }
</script>

<style scoped>

</style>