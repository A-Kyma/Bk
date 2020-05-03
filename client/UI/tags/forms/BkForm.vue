<template>
    <b-form :inline="inline">
        <slot :model="getModel" :for="$props.for">
            <bk-field-list :model="getModel"
                           :for="$props.for"
                           :fields="$props.fields"
                           :label-cols="$props['label-cols']"
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
      "label-cols": String,
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