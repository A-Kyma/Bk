<!-- We added $parent.$attrs to get the "non-props" attributes from "bk-form" element -->
<template>
    <b-form-group v-bind="{...$parent.$attrs,...$attrs}"
                  :valid-feedback="validFeedback"
                  v-if="canView"
    >
        <template
                v-if="!noLabel"
                #label>
            {{label}}
        </template>

        <bk-inner-input
                v-bind="{...$parent.$attrs,...$props, ...$attrs}"
                @state="onState"
                @validationError="onError"
                :model="inputModel"
        />
        <b-form-invalid-feedback :state="state">
            <span v-html="invalidFeedback"/>
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import I18n from "../../../../lib/classes/i18n";
  import _ from "lodash";

  export default {
    name: "BkInput",
    props: {
      model: Class,
      field: String,
      for: String,
      //plaintext: Boolean,
      noLabel: Boolean,
    },
    // Pay attention that injected objects are not reactive
    inject: ["formModel"],
    data() {
      return {
        invalidFeedback: null,
        state: null,
      }
    },

    /* Use of meteor instead of computed here implies version 2+ of vue-meteor-tracker */
    computed: {
      // model from props or injection
      inputModel() {
        return this.model || this.formModel;
      },
      // If for view or if readonly field, return true
      plaintext() {
        if (this.$props.for === "view") {
          return true;
        }
        if (!this.inputModel.canEdit(this.field)) {
          return true;
        }
        return this.$props.plaintext;
      },
      canView() {
        return this.inputModel.canView(this.field);
      },
      placeholder() {
        return "Enter " + this.field
      },
      validFeedback() {
        return "Ok"
      },

    },
    methods: {
      onState(state) {
        this.state = state;
      },
      onError(error) {
        this.invalidFeedback = error;
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity : ReactiveMap or ReactiveVar */
    meteor: {
      label() {
        if (this.noLabel) { return }
        return I18n.t(this.inputModel.constructor.getLabelKey(this.field))
      },
    }
  }
</script>

<style scoped>

</style>