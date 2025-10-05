<template>
  <label :class="computedClass"><t :options="context" :locale="locale">{{label}}</t>
    <b-icon-asterisk
      v-if="required"
      variant="danger"
      font-scale="0.5"
      shift-v="10"
    />
  </label>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy";

  export default {
    name: "BkLabel",
    props: {
      model: Class,
      field: String,
      for: String,
      noLabel: Boolean,
      noRequired: Boolean,
      locale: String
    },
    inject: ["formModel"],
    computed: {
      computedClass() {
        if (this.noLabel) return "sr-only"
        return this.ui.labelClass
      },
      label() {
        return this.model.constructor.getLabelKey(this.field)
      },
      context(){
        let value = {}
        let labelContext = this.$attrs["label-context"]
        if (labelContext === undefined) return
        if(labelContext.name && labelContext.value){
          value[labelContext.name] = labelContext.value
          return value
        }
        return
      },
      definition() {
        return this.model.getDefinition(this.field);
      },
      ui() {
        return this.definition?.ui || {};
      },
      required() {
        if (this.noRequired) return false;
        if (this.$props.for === "view") return false;
        let optional
        if (typeof this.definition.optional === "function")
          optional = this.definition.optional(this.model, this.formModel)
        else
          optional = this.definition.optional
        return !optional;
      },
    },
  }
</script>

<style scoped>

</style>