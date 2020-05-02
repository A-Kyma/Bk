<template>
    <div>
        <bk-input :model="model" :field="field" v-for="field in fieldsArray"/>
    </div>
</template>

<script>
  import Class from "meteor/jagi:astronomy"
  import Bk from "../../../../lib/utils/BkCore"

  export default {
    name: "BkFieldList",
    props: {
      model: Class,
      fields: [Array,String],
      exclude: [Array,String],
      for: String,
      noEdit: Array,
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