<template>
    <bk-inner-input :model="model" :field="field" :for="view" plaintext/>
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