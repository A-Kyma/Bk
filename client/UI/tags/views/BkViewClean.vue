<template>
  <span>
  <slot name="lifecycle" v-bind="{classDefinition, model,field, value}">
    <b-button v-if="classDefinition.name === 'Lifecycle'" name="lifecycle"
              :variant="classDefinition.getStateVariant(model[field])"
              pill disabled>
      <t :key="value">{{value}}</t>
    </b-button>

    <t v-else-if="classDefinition.name === 'Enum'" :key="value">{{value}}</t>

    <span v-else>{{value}}</span>
  </slot>
  </span>

</template>

<script>
import Class from "meteor/jagi:astronomy"

export default {
  name: "BkViewClean",
  props: {
    model: Class,
    field: String,
    format: String,
  },
  computed: {
    classDefinition() {
      return this.model.getFieldClass(this.field);
    },
  },
  meteor: {
    value() {
      return this.model.getValue(this.field, this.format);
    }
  },
  }
</script>

<style scoped>

</style>