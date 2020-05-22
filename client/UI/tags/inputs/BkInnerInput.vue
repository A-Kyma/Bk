<template>
    <component
            v-if="definitionField === 'Scalar'"
            v-bind="$attrs"
            :is="inputComponent"
            :type="inputType"
            v-model="value"
            :state="state"
            :placeholder="placeholder"
            :name="field"
            :plaintext="plaintextComputed"
    />

    <b-form-radio-group
            v-else-if="definitionField === 'Enum'"
            v-bind="$attrs"
            v-model="value"
            :state="state"
            :name="field"
            :options="enumOptions"
    />

    <b-form-checkbox
        v-else-if="definitionField === 'Boolean'"
        v-bind="$attrs"
        v-model="value"
        :state="state"
        :name="field"
        size="lg"
        switch/>

    <bk-field-list
            v-else-if="definitionField === 'Object'"
            v-bind="$attrs"
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

    <b-form-checkbox-group
        v-else-if="definitionField === 'ListEnum'"
        v-model="value"
        :state="state"
        :options="enumOptions"
        :name="field"
    />

    <b-form-tags
            v-else-if="definitionField === 'ListString'"
            v-model="value"
            :state="state"
            remove-on-delete
            separator=" "
            :tag-validator="tagValidator"
            :invalid-tag-text="invalidTagText"
            :placeholder="placeholder"
            :disabled="plaintextComputed"
    />
    <!-- TODO: is span OK ?-->
    <span v-else-if="definitionField === 'ListValue'">
        {{model[field].join(', ')}}
    </span>

</template>

<script>
  import {Class, ValidationError} from 'meteor/jagi:astronomy';
  import Enum from "../../../../lib/modules/customFields/customs/Enum"
  import I18n from "../../../../lib/classes/i18n";
  import _ from "lodash";

  function isGenericInputType(originalFieldType = "") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    return ["text", "number", "email", "password", "search", "url", "tel", "range", "color"].includes(fieldType);

  }

  export default {
    name: "BkInnerInput",
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String,
      plaintext: Boolean,
      showAlert: Boolean
    },

    data() {
      return {
        oldValue: null,
        invalidTagText: "Tag is invalid",
      }
    },

    created() {
      // oldValue will be used to check value when component created and value in the screen
      this.oldValue = _.cloneDeep(this.model.raw(this.field));
    },

    computed: {
      value: {
        set: function (value) {
          this.model.set(this.field, value, {cast: true})
          this.model.isValid(this.field);
        },
        get: function (value) {
          return this.model.get(this.field);
        }
      },

      enumOptions() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }
        let definitionClass = fieldDefinition.constructor.name;
        let fieldType = fieldDefinition.type.name;
        let Enum = fieldDefinition.type.class
        let identifiers = Enum.getIdentifiers()

        return _.map(identifiers, x => {
            return {"text": I18n.t("Enum." + fieldType + "." + x + ".label"), "value": x}
          }
        )
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
            if (fieldDefinition.type.class.name === "Enum") {
              return "ListEnum"
            }
            return "ListValue";

          case 'ScalarField':
            if (fieldDefinition.type.class.name === "Enum") {
              return "Enum";
            }
            if (fieldDefinition.type.class.name === "Boolean") {
              return "Boolean"
            }
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
            return fieldType.toLowerCase()
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

    methods: {
      tagValidator(tag) {
        let model = new (this.model.constructor)();
        model.set(this.field,[tag]); // tag is in an array
        try {
          model.validate({fields: this.field})
        } catch(err) {
          if (ValidationError.is(err)) {
            //TODO should be managed by I18n
            this.invalidTagText = err.details[0].message;
            return false
          }
        }
        return true;
      }
    },

    meteor: {
      state() {
        let errors = this.model.getError(this.field);
        if (errors) {
          // TODO: errors should be managed by I18n translations

          this.$emit("validationError", errors.map((value, key) => value.message).join('<br/>'))
          this.$emit("state", false);
          return false
        } else {
          if (_.isEqual(this.value, this.oldValue) || !this._isMounted) {
            this.$emit("state", null)
            return null
          } else {
            this.$emit("state", true)
            return true
          }
        }
      }
    },
  }
</script>

<style scoped>

</style>