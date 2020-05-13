<!-- We added $parent.$attrs to get the "non-props" attributes from "bk-form" element -->
<template>
    <b-form-group v-bind="{...$parent.$attrs,...$attrs}"
                  :valid-feedback="validFeedback"
    >
        <template
                v-if="!noLabel"
                #label>
            {{label}}
        </template>

        <bk-inner-input
                v-bind="{...$parent.$attrs,...$props, ...$attrs}"
                @state="onState"
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
      formField: String,
      for: String,
      //plaintext: Boolean,
      noLabel: Boolean,
    },
    // Pay attention that injected objects are not reactive
    inject: ["formModel"],
    data() {
      return {
        oldValue: null,
        componentLoaded: false,
        state: null,
      }
    },

    created() {
      // oldValue will be used to check value when component created and value in the screen
      this.oldValue = _.cloneDeep(this.inputModel.raw(this.field));
    },
    beforeUpdate() {
      this.componentLoaded = true;
    },
    /* Use of meteor instead of computed here implies version 2+ of vue-meteor-tracker */
    computed: {
      //
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
      placeholder() {
        return "Enter " + this.field
      },
      validFeedback() {
        return "Ok"
      },

    },
    methods: {
      onState(state) {
        this.state=state;
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity : ReactiveMap or ReactiveVar */
    meteor: {
      label() {
        if (this.noLabel) { return }
        return I18n.t(this.inputModel.constructor.getLabelKey(this.field))
      },
      invalidFeedback() {
        let errors = this.inputModel.getError(this.field);
        if (errors) {
          // TODO: errors should be managed by translations
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