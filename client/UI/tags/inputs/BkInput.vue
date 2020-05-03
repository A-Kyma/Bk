<template>
    <b-form-group v-bind="{...$props, ...$attrs}"
                  :valid-feedback="validFeedback"
    >
        <template v-if="!noLabel" #label>{{label}}</template>
        <bk-inner-input v-bind="{...$props, ...$attrs}" v-model="model[field]"/>
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
      for: String,
      //plaintext: Boolean,
      noLabel: Boolean,
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
      validFeedback() {
        return "Ok"
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity */
    meteor: {
      label() {
        if (this.noLabel) { return }
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