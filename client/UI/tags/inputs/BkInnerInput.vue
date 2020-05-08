<template>
    <component
            v-if="definitionField === 'Scalar'"
            v-bind="{...$props, ...$attrs}"
            :is="inputComponent"
            :type="inputType"
            :model="model.constructor.getName()"
            v-model="value"
            :state="state"
            :placeholder="placeholder"
            :name="field"
            :plaintext="plaintextComputed"
    />

    <bk-field-list
            v-else-if="definitionField === 'Object'"
            v-bind="{...$props, ...$attrs}"
            :model="model[field]"
            :form-field="formFieldComputed"
            fields=""
    />
    <!-- TODO: Maybe use ul/li here ? We have an array of subclasses-->
    <component v-else-if="definitionField === 'ListClass'">
        <bk-inner-input
                v-bind="{...$props, ...$attrs}"
                v-for="innerModel in model[field]"
                :model="innerModel"
                :form-field="formFieldComputed"
        />
    </component>

    <b-form-tags
            v-else-if="definitionField === 'ListString'"
            v-model="value"
            :state="state"
            remove-on-delete
            separator=" "
            :placeholder="placeholder"
            :disabled="plaintextComputed"
    />
    <!-- TODO: is span OK ?-->
    <span v-else-if="definitionField === 'ListValue'">
        {{model[field].join(', ')}}
    </span>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import I18n from "../../../../lib/classes/i18n";

  function isGenericInputType(originalFieldType="") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    if (["text","number","email","password","search","url","tel","range","color"].includes(fieldType)) {
      return true;
    }
    return false;
  }

  export default {
    name: "BkInnerInput",
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String,
      state: Boolean,
      plaintext: Boolean,
    },

    computed: {
      value: {
        set: function (value) {
          this.model.set(this.field, value, {cast: true})
        },
        get: function (value) {
          return this.model.get(this.field);
        }
      },
      formFieldComputed() {
         return this.formField && this.formField + "." + this.field || this.field;
      },

      // If for view or if readonly field, return true
      plaintextComputed() {
        if (this.$props.for === "view") {
          return true;
        }
        if (!this.model.canEdit(this.field)) {
          return true;
        }
        return this.$props.plaintext;
      },
      required() {
        return false; //!this.model.getDefinition(this.field, "optional");
      },
      placeholder() {
        return I18n.t(this.model.constructor.getPlaceHolderKey(this.field));
      },
      definitionField() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }
        let definitionClass = fieldDefinition.constructor.name;
        let fieldType = fieldDefinition.type.name;
        switch (definitionClass) {
          case 'ObjectField':
            return "Object";

          case 'ListField':
            // it's a new class object
            if (fieldType === "Class") {
              return "ListClass";
            }
            // We can have a form tag since we have string values
            if (fieldDefinition.type.class.prototype instanceof String) {
              //this.value = this.value.join(", ");
              return "ListString"
            }
            return "ListValue";

          case 'ScalarField':
            return "Scalar";
        }
      },
      inputType() {
        if (this.inputComponent === "BFormInput") {
          let fieldDefinition = this.model.getDefinition(this.field);
          let fieldType = fieldDefinition.type.name;

          if (fieldDefinition.ui && fieldDefinition.ui.type) {
            return fieldDefinition.ui.type;
          }

          // Field Type is a generic Input Type
          if (isGenericInputType(fieldType)) {
            return fieldType.toLowerCase();;
          }

        }
        return undefined;
      },
      inputComponent() {
        let fieldDefinition = this.model.getDefinition(this.field);
        // Check if field really exists :
        if (!fieldDefinition) {
          return {template: null};
        }

        // Allow forcing template in field definition, ui part
        if (fieldDefinition.ui && fieldDefinition.ui.template) {
          return fieldDefinition.ui.template;
        }

        let fieldType = fieldDefinition.type.name;
        let templateType = fieldType.toLowerCase();

        if (isGenericInputType(fieldType) || fieldType === "String") {
          return "BFormInput";
        }

        if (fieldType === "Date") {
          return "BFormDatepicker"
        }

        if (fieldType === "Time") {
          return "BFormTimepicker"
        }

        return "BFormInput";
      }
    },
    /* Needed to be put in Meteor side since we use Meteor reactivity */
    meteor: {
      /*
      state() {
        console.log("State inner input : " + this.field);
        console.log(this);
        if (!this.componentLoaded) {
          return null;
        }
        // Check if value when entering creating the component has changed
        if (_.isEqual(this.model.raw(this.field),this.oldValue)) {
          return null;
        }
        if (this.model.isPersisted() && !this.model.isModified(this.field)) {
          return null;
        }
        return this.model.isValid(this.field,{stopOnFirstError: false});
      }
      */
    }
  }
</script>

<style scoped>

</style>