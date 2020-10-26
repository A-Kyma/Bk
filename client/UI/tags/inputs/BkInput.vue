<!-- We added $parent.$attrs to get the "non-props" attributes from "bk-form" element -->
<template>
  <transition name="slide-fade" appear>
    <b-card v-if="ui.collapsible || ui.accordion" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block @click="toggleAccordion" v-bind="$attrs">
          {{label}}
        </b-button>
      </b-card-header>
      <b-collapse
          :id="accordionId"
          visible
          :accordion="accordionGroupId"
          role="tabpanel">
        <b-card-body>
          <bk-inner-input
              v-bind="{...$parent.$attrs,...$props, ...$attrs}"
              @state="onState"
              @validationError="onError"
              :model="inputModel"
          />
          <b-form-invalid-feedback :state="state">
            <span v-html="invalidFeedback"/>
          </b-form-invalid-feedback>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-form-group v-bind="{...$parent.$attrs,...$attrs}"
                  :valid-feedback="validFeedback"
                  v-else-if="canView"
                  :label-class="ui.labelClass"
                  :label-size="ui.labelSize"
    >
      <template v-if="!noLabel && !ui.collapsible" #label>
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
  </transition>
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
        return ""
      },
      ui() {
        if (this.noUI) {return {}};
        return this.definition.ui || {};
      },
      definition() {
        return this.model.getDefinition(this.field) || {};
      },
      accordionId(){
        return this.field + "_" + this._uid;
      },
      // If accordion, only one open
      // if not, all will be opened at start
      accordionGroupId() {
        if (this.ui.accordion) {
          return this.model.constructor.getName();
        } else {
          return this.model.constructor.getName()+'_' + this._uid;
        }
      }
    },
    methods: {
      onState(state) {
        this.state = state;
      },
      onError(error) {
        this.invalidFeedback = error;
      },
      toggleAccordion() {
        this.$root.$emit('bv::toggle::collapse', this.accordionId)
      },
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
  /* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
  /* peuvent utiliser différentes fonctions de durée et de temps.  */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  </style>