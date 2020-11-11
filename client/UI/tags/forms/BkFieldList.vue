<template>
    <div>
        <bk-input v-bind="$attrs"
                  :model="inputModel"
                  :field="field"
                  v-for="field in fieldsArray"/>
    </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import getFieldsArray from "../../utils/getFieldsArray";

export default {
    name: "BkFieldList",
    props: {
      model: Class,
      fields: [Array,String],
      exclude: [Array,String],
      noEdit: [String,Array],
    },
    inject: ["formModel"],
    computed: {
      inputModel() {
        return this.model || this.formModel;
      },
      fieldsArray() {
        let fieldsArray = getFieldsArray({
          model: this.inputModel,
          fields: this.fields,
          exclude: this.exclude
        });
        return fieldsArray;
      }
    },
  }
</script>

<style scoped>

</style>