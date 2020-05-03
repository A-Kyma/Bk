<template>
    <component
            :is="inputComponent"
            v-model="model[field]"
            :placeholder="placeholder"
            :state="state"
            :name="field"
            :plaintext="plaintext"
    />
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import I18n from "../../../../lib/classes/i18n";

  export default {
    name: "BkInnerInput",
      props: {
        model: Class,
        field: String,
        for: String,
        state: Boolean
        //plaintext: Boolean,
      },
    data() {
      return {
        componentLoaded: false,
      }
    },
    beforeUpdate() {
      this.componentLoaded = true;
    },
    computed: {
      // If for view or if readonly field, return true
      plaintext() {
        if (this.$props.for === "view") {
          return true;
        }
        if (!this.model.canEdit(this.field)) {
          return true;
        }
        return this.$props.plaintext;
      },
      placeholder() {
        return "Enter " + this.field
      },
      inputComponent() {
        // Check if field really exists :
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }

        // Then return the right input form
        return "b-form-input";
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity */
    meteor: {
      state() {
        if (!this.componentLoaded) {
          return null;
        }
        if (this.model.isPersisted() && !this.model.isModified(this.field)) {
          return null;
        }
        return this.model.isValid(this.field);
      }
    }
  }
</script>

<style scoped>

</style>