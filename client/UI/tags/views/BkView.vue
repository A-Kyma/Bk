<template>
    <bk-view-inner v-if="noDiv" v-bind="$props"/>
    <div v-else-if="noFormGroup" class="row">
        <bk-view-inner v-bind="$props"/>
    </div>
    <div v-else class="form-group is-focused row">
        <bk-view-inner v-bind="$props"/>
    </div>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy"

  export default {
    name: "BkView",
    props: {
      model: Class,
      field: String,
      noDiv: Boolean,
      noFormGroup: Boolean,
      noLabel: Boolean,
      noHtml: Boolean
    },
  }
</script>

<style scoped>

</style>