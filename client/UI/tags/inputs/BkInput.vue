<template>
    <b-form-group :label="label"
                  :valid-feedback="validFeedback"
                  :state="state">
        <component :is="inputComponent"
                   v-model="model[field]"
                   :placeholder="placeholder"
                   :state="state"
                   :name="field"
        />
        <b-form-invalid-feedback :state="state">
            <span v-html="invalidFeedback"/>
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import I18n from "../../../../lib/classes/i18n";

  export default {
    name: "BkInput",
    props: {
      model: Class,
      field: String,
      context: Object
    },
    data() {
      return {
        componentLoaded: false,
      }
    },
    beforeUpdate() {
      this.componentLoaded = true;
    },
    /* Use of meteor instead of computed here implies version 2+ of vue-meteor-tracker */
    computed: {
      placeholder() {
        return "Enter " + this.field
      },
      validFeedback() {
        return "Ok"
      },
      inputComponent() {
        // Check if field really exists :
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) { return null; }

        // Then return the right input form
        return "b-form-input";
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity */
    meteor: {
      label() {
        return I18n.t(this.model.constructor.getLabelKey(this.field))
      },
      state() {
        if (!this.componentLoaded) {
          return null;
        }
        if (this.model.isPersisted() && !this.model.isModified(this.field)) {
          return null;
        }
        return this.model.isValid(this.field);
      },
      invalidFeedback() {
        let errors = this.model.getError(this.field);
        if (errors) {
          return errors.map((value, key) => value.message).join('<br/>');
        } else {
          return "";
        }
      }
    }
  }
</script>

<style scoped>

</style>