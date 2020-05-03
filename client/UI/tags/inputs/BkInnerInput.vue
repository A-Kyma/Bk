<template>
    <component
            v-bind="{...$props, ...$attrs}"
            :is="inputComponent.template"
            v-model="model[field]"
            :placeholder="placeholder"
            :state="state"
            :name="field"
            :plaintext="plaintext"
            :type="inputComponent.type"
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
          return { template: null } ;
        }
        let fieldType = fieldDefinition.type.name;
        let definitionClass = fieldDefinition.constructor.name;
        let templateName;

        switch (definitionClass) {
          case 'ObjectField':
            templateName = "BkInputHash";
            break;

          case 'ListField':
            // it's a new class object
            if (fieldType === "Class") {
              templateName = 'BkInputArrayClass';
            } else {
              //this.value = this.value.join(", ");
              templateName = 'BkInputArrayType';
            }
            break;

          case 'ScalarField':
            if (fieldDefinition.type.templateName && fieldDefinition.type.templateName()) {
              templateName = fieldDefinition.type.templateName();
              break;
            }
            templateName = "BkInput" + fieldType;
            if (Template[templateName]) {
              break;
            }
            templateName = "BFormInput";
            break;

          default:
            this.tag = "_viewType";
            this.type = type;
            templateName = "_tagFieldError";
        }
        console.log("Template: " + templateName + " for field " + this.field);
        // Then return the right input form
        return { template: "BFormInput", type: undefined };
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