<template>
  <span>
  <slot name="lifecycle" v-bind="{classDefinition, model,field, value}">
    <b-button v-if="classDefinitionName === 'Lifecycle'" name="lifecycle"
              :variant="classDefinition.getStateVariant(model[field])"
              pill disabled>
      <t :key="value">{{value}}</t>
    </b-button>

    <t v-else-if="classDefinitionName === 'Enum'" :key="value">{{value}}</t>

    <span v-else>{{value}}</span>
  </slot>
  </span>

</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import Lifecycle from "../../../../lib/modules/customFields/customs/Lifecycle";
import Enum from "../../../../lib/modules/customFields/customs/Enum";

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
    classDefinitionName() {
      let fieldClass = this.classDefinition
      if (Enum.includes(fieldClass)) return "Enum"
      if (Lifecycle.includes(fieldClass)) return "Lifecycle"
      return "Other"
    }
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