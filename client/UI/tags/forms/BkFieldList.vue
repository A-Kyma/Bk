<template>
    <div>
        <bk-input :model="model" :field="field" :label-cols="$props['label-cols']" v-for="field in fieldsArray"/>
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
      "label-cols": String,
    },
    computed: {
      fieldsArray() {
        let fieldsArray = Bk.getFieldsArray({
          model: this.model,
          fields: this.fields
        });
        console.log("Fields: " + fieldsArray);
        return fieldsArray;
      }
    },
  }
</script>

<style scoped>

</style>