<template>
  <span>
  <slot name="lifecycle" v-bind="{classDefinition, model,field, value}">
    <b-button v-if="classDefinitionName === 'Lifecycle'" name="lifecycle"
              :variant="classDefinition.getStateVariant(model[field])"
              pill disabled>
      <t :key="value">{{value}}</t>
    </b-button>

    <span v-for="(text, index) in value" v-else-if="classDefinitionName === 'ListEnum'">
      <span v-if="index !== 0">, </span>
      <t :key="text">{{text}}</t>
    </span>

    <t v-else-if="classDefinitionName === 'Enum'" :key="value">{{value}}</t>

    <b-icon v-else-if="classDefinitionName === 'Color'" icon="circle-fill" :color="value"></b-icon>

    <b-form-checkbox v-else-if="classDefinitionName === 'Boolean'" v-model="value" disabled/>

    <span v-else>{{value}}</span>
  </slot>
  </span>

</template>

<script>
import {Class,ListField} from "meteor/jagi:astronomy"
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
      let definition = this.model.getDefinition(this.field)
      let fieldClass = this.classDefinition
      if (Enum.includes(fieldClass) && definition instanceof ListField) return "ListEnum"
      if (Enum.includes(fieldClass)) return "Enum"
      if (Lifecycle.includes(fieldClass)) return "Lifecycle"
      return definition.type.name
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