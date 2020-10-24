<template>
    <bk-inner-input v-bind="$props" for="view"/>
</template>

<script>
import Class from "meteor/jagi:astronomy"

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