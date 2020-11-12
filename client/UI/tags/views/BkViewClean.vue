<template>
  <b-button v-if="classDefinition.name === 'Lifecycle'"
            :variant="classDefinition.getStateVariant(model[field])"
            pill disabled>
    <t>{{classDefinition.getLabelKey(model[field])}}</t>
  </b-button>

  <span v-else>{{value}}</span>

</template>

<script>
import Class from "meteor/jagi:astronomy"

export default {
  name: "BkViewClean",
  props: {
    model: Class,
    field: String,
  },
  computed: {
    classDefinition() {
      return this.model.getFieldClass(this.field);
    },
  },
  meteor: {
    value() {
      return this.model.getValue(this.field)
    }
  },
  }
</script>

<style scoped>

</style>