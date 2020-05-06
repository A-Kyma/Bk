<template>
    <div>
        <bk-input v-bind="$props"
                  :model="model"
                  :field="field"
                  v-for="field in fieldsArray"/>
    </div>
</template>

<script>
  import Class from "meteor/jagi:astronomy"
  import { Bk } from "../../../../lib/lib.js"

  export default {
    name: "BkFieldList",
    props: {
      model: Class,
      fields: [Array,String],
      exclude: [Array,String],
      for: String,
      noEdit: [String,Array],
    },
    computed: {
      fieldsArray() {
        let fieldsArray = Bk.getFieldsArray({
          model: this.model,
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