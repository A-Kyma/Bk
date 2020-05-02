<template>
    <b-form>
        <slot :model="getModel" :for="$props.for">
            <bk-field-list :model="getModel" :for="$props.for" :fields="$props.fields"/>
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
      fields: Array
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