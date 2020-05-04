<template>
    <!-- one root element only ! -->
    <span>
        <bk-label v-if="!noLabel" :model="model" :field="field"/>
        <a v-if="url !== undefined" :href="url">
            <bk-view-clean v-bind="{...$props, ...$attrs}"/>
        </a>
        <bk-view-clean v-else v-bind="{...$props, ...$attrs}"/>
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
        return this.model.getDefinition(this.field,"url");
      }
    },
  }
</script>

<style scoped>

</style>