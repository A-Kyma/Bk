<template>
    <b-form-group :label="label"
                  :valid-feedback="validFeedback"
                  :state="state">
        <b-form-input v-model="model[field]" :placeholder="placeholder" :state="state" :name="field"/>
        <b-form-invalid-feedback :state="state">
            <span v-html="invalidFeedback"/>
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';

  export default {
    name: "bk-input",
    props: {
      model: Class,
      field: String
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
      state() {
        if (!this.componentLoaded) {
          return null;
        }
        if (this.model.isPersisted() && !this.model.isModified(this.field)) {
          return null;
        }
        return this.model.isValid(this.field);
      },
      placeholder() {
        return "Enter " + this.field
      },
      label() {
        return this.model.constructor.getLabelKey(this.field)
      },
      validFeedback() {
        return "Ok"
      },
      invalidFeedback() {
        let errors = this.model.getError(this.field);
        if (errors) {
          return errors.map((value, key) => value.message).join('<br>');
        } else {
          return "";
        }
      }
    }
  }
</script>

<style scoped>

</style>