<template>
    <!-- one root element only ! -->
    <span>
        <bk-label v-if="!noLabel" for="view" :model="model" :field="field" :locale="locale"/>
        <a v-if="url !== undefined" :href="url">
            <bk-view-clean v-bind="{...$props,...$attrs}"/>
        </a>
        <bk-view-clean v-else v-bind="{...$props,...$attrs}"/>
    </span>
</template>

<script>
  import {Class} from "meteor/jagi:astronomy"
  import BkLabel from "../forms/BkLabel";
  import BkViewClean from "./BkViewClean";

  export default {
    name: "BkViewInner",
    components: {BkLabel,BkViewClean},
    props: {
      model: Class,
      field: String,
      noLabel: Boolean,
      format: String,
      locale: String,
      fileFormat: String,
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