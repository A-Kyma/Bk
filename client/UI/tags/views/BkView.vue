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
  import BkViewInner from "./BkViewInner";
  export default {
    name: "BkView",
    components: {BkViewInner},
    props: {
      model: Class,
      field: String,
      noDiv: Boolean,
      noFormGroup: Boolean,
      noLabel: Boolean,
      noHtml: Boolean,
      format: String,
      locale: String,
      fileFormat: String,
    },
  }
</script>

<style scoped>

</style>