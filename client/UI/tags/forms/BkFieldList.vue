<template>
    <div>
        <bk-input v-bind="$attrs"
                  :model="inputModel"
                  :field="field"
                  v-for="field in fieldsArray">

          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>

        </bk-input>
    </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"

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
        let fields = this.fields;
        let exclude = this.exclude;
        return this.inputModel.constructor.getFieldsNamesByFilter({fields,exclude});
      }
    },
  }
</script>

<style scoped>

</style>