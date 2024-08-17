<template>
  <span>
  <slot name="lifecycle" v-bind="{classDefinition, model,field, value}">
    <b-button v-if="classDefinitionName === 'Lifecycle'" name="lifecycle"
              :variant="classDefinition.getStateVariant(model[field])"
              pill disabled>
      <t :key="value" :locale="locale" :options="options">{{value}}</t>
    </b-button>

    <span v-for="(text, index) in value" v-else-if="classDefinitionName === 'ListEnum'">
      <span v-if="index !== 0">, </span>
      <t :key="text" :locale="locale">{{text}}</t>
    </span>

    <t v-else-if="classDefinitionName === 'Enum'" :key="value" :locale="locale" :options="options">
      {{value}}
    </t>

    <b-icon v-else-if="classDefinitionName === 'Color'" icon="circle-fill" :color="value"></b-icon>

    <b-form-checkbox v-else-if="classDefinitionName === 'Boolean'" v-model="value" disabled/>

    <b-avatar v-else-if="classDefinitionName === 'Avatar'"
              v-bind="$attrs"
              :src="staticLink(fileFormat)"
              :key="value"
    >
      <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
      </template>
    </b-avatar>

    <b-form-rating
        v-else-if="classDefinitionName === 'Rating'"
        v-model="value"
        readonly
        v-bind="$attrs"
    />

    <b-progress
      v-else-if="classDefinitionName === 'Percentage'"
      max="100"
      show-progress
      animated
    >
      <b-progress-bar :value="value">
        <span v-if="value">{{value}}%</span>
      </b-progress-bar>
    </b-progress>

    <span v-else>{{value}}</span>
  </slot>
  </span>

</template>

<script>
import {Class,ListField} from "meteor/akyma:astronomy"
import Lifecycle from "../../../../lib/modules/customFields/customs/Lifecycle";
import Enum from "../../../../lib/modules/customFields/customs/Enum";

export default {
  name: "BkViewClean",
  props: {
    model: {
      type: Class,
      required: true
    },
    field: String,
    format: String,
    locale: String,
    options: {
      type: [Object, Array],
      default() { return {}}
    },
    fileFormat: {
      type: String,
      default: "normal"
    }
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
    },
  },

  meteor: {
    value() {
      return this.model.getValue(this.field, this.format);
    }
  },

  methods: {
    staticLink(format) {
      let fileId = this.value
      if (!format) format="original"
      if (fileId === undefined && this.default) return this.default
      if (fileId === undefined) return
      return Meteor.absoluteUrl("/cdn/storage/Files/" + fileId + "/" + format + "/" + fileId + ".jpg")
    },
  },
}
</script>

<style scoped>

</style>