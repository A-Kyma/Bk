<template>
    <b-form :inline="inline">
        <slot v-bind="{...$props, ...$attrs}" :model="getModel">
            <bk-field-list v-bind="{...$props, ...$attrs}" :model="getModel"
            />
        </slot>
    </b-form>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy";
  import BkFieldList from "./BkFieldList";

  export default {
    name: "BkForm",
    components: {BkFieldList},
    props: {
      model: [String,Class],
      for: String,
      fields: [String,Array],
      exclude: [String,Array],
      noEdit: [String,Array],
      inline: Boolean,
    },
    meteor: {
      getModel() {
        return Class.getModel(this.model);
      }
    }
  }
</script>

<style scoped>

</style>