<template>
    <!-- one root element only ! -->
    <span>
        <bk-label v-if="!noLabel" :model="model" :field="field"/>
        <a v-if="url !== undefined" :href="url">
            <bk-view-clean v-bind="$props"/>
        </a>
    </span>
</template>

<script>
  import {Class} from "meteor/jagi:astronomy"

  export default {
    name: "BkViewInner",
    props: {
      model: Class,
      field: String,
      noLabel: Boolean
    },
    computed: {
      url() {
        let fieldDefinition = this.model.getDefinition(this.field);
        return fieldDefinition && fieldDefinition.url;
      }
    },
  }
</script>

<style scoped>

</style>