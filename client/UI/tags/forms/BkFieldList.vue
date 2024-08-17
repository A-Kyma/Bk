<template>
    <div>
        <bk-input v-bind="$attrs"
                  :model="inputModel"
                  :field="field"
                  v-for="field in fieldsArray"
                  :exclude="excludeComputed(field)"
                  @input="$emit('change',{field: field,value: inputModel[field]})"
                  @select="$emit('select',field,$event)"
                  @tag="$emit('tag',$event)"
        >

          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>

        </bk-input>
    </div>
</template>

<script>
import { Class } from "meteor/akyma:astronomy"

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
  methods: {
    excludeComputed(field) {
      let result=[]
      let exclude=[];
      if (this.exclude) {
        if (typeof (this.exclude) === "string") {
          exclude = this.exclude.replace(RegExp(" ", "g"), "").split(",");
        }
        if (Array.isArray(this.exclude)) {
          exclude = this.exclude;
        }
      }
      exclude.forEach(f => {
        if (!f)
          return result;
        let decomposition = f.split(".")
        if (decomposition[0] === field && decomposition.length > 1)
          decomposition.splice(0,1)
        let subfield = decomposition.join(".")
        result.push(subfield)
      })
      return result;
    }
  },
  }
</script>

<style scoped>

</style>