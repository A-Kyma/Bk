<!-- We added $parent.$attrs to get the "non-props" attributes from "bk-form" element -->
<!-- Slot <field>-form-group will replace all the bk-input (no b-card or form-group) -->
<!-- Slot <field>-label will replace the label -->
<!-- Slot <field> will replace the field's inner input -->
<template>
  <transition name="slide-fade" appear>
    <slot :name="formGenericFieldComputed + '-form-group'" v-bind="$props">
      <b-card v-if="ui.collapsible || ui.accordion"
              no-body
              :class="'mb-1 ' + this.model.constructor.getName()"
              :id="field">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block @click="toggleAccordion" v-bind="$attrs">
            <slot :name="formFieldComputed + '-label'" v-bind="$props">
              <bk-label v-bind="$props" noRequired/>
            </slot>
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
                @input="$emit('input')"
                @change="$emit('change')"
            >

              <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                <slot :name="slot" v-bind="props" />
              </template>

            </bk-inner-input>

            <b-form-invalid-feedback :state="state">
              <span v-html="invalidFeedback"/>
            </b-form-invalid-feedback>
          </b-card-body>
        </b-collapse>
      </b-card>
      <div v-else-if="ui.basic">
        <div class="col-lg-12 basic-group" :class="accordionGroupId" :id="field">
          <slot :name="formFieldComputed + '-label'" v-bind="$props">
            <bk-label v-bind="$props" noRequired/>
          </slot>
        </div>
        <bk-inner-input
                v-bind="{...$parent.$attrs,...$props, ...$attrs}"
                @state="onState"
                @validationError="onError"
                @input="$emit('input')"
                @change="$emit('change')"
                :model="inputModel">

          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>

        </bk-inner-input>

        <b-form-invalid-feedback :state="state">
          <span v-html="invalidFeedback"/>
        </b-form-invalid-feedback>
      </div>
      <b-form-group v-bind="{...$parent.$attrs,...$attrs}"
                    :valid-feedback="validFeedback"
                    v-else-if="canView"
                    :label-class="ui.labelClass"
                    :label-size="ui.labelSize"
      >
        <template #label>
          <slot :name="formGenericFieldComputed + '-label'" v-bind="$props">
            <bk-label v-bind="$props"/>
          </slot>
        </template>

          <bk-inner-input
              v-bind="{...$parent.$attrs,...$props, ...$attrs}"
              @state="onState"
              @validationError="onError"
              @input="$emit('input')"
              :model="inputModel">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-inner-input>

          <b-form-invalid-feedback :state="state">
              <span v-html="invalidFeedback"/>
          </b-form-invalid-feedback>
      </b-form-group>
    </slot>
  </transition>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import _ from "lodash";
  import BkLabel from "../forms/BkLabel";

  export default {
    name: "BkInput",
    components: {BkLabel},
    props: {
      model: Class,
      field: String,
      for: String,
      formField: String,
      formGenericField: String,
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
      // Used for slots, we do not have index for arrays, so all fields in array are replaced
      formGenericFieldComputed() {
        if (this.formGenericField) return this.formGenericField + "." + this.field;
        return this.formFieldComputed;
      },
      formFieldComputed() {
        return this.formField && this.formField + "." + this.field || this.field;
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
      // If accordion, only one open
      // if not, all will be opened at start
      accordionId() {
        return "Collapse_" + this.field + "_" + this._uid;
      },
      accordionGroupId() {
        if (this.ui.accordion || this.ui.basic) {
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