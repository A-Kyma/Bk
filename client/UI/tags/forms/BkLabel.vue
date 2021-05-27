<template>
  <label :class="computedClass"><t>{{label}}</t>
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
    },
    computed: {
      computedClass() {
        if (this.noLabel) return "sr-only"
        return this.ui.labelClass
      },
      label() {
        return this.model.constructor.getLabelKey(this.field)
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
        return !this.model.getDefinition(this.field).optional;
      },
    },
  }
</script>

<style scoped>

</style>