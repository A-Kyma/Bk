<template>
  <b-input-group
      v-bind="$attrs"
      :prepend="prepend"
      :append="append">

    <bk-field-list
            v-if="definitionField === 'Object'"
            v-bind="$attrs"
            class="col-12"
            :model="model[field]"
            :form-field="formFieldComputed"
            fields=""
    />

    <bk-card-list-class
        v-else-if="definitionField === 'ListClass'"
        v-bind="{...$props,...$attrs}"
        :model="model"
        :field="field"
        :form-field="formFieldComputed"
    />

    <b-form-checkbox-group
        v-else-if="definitionField === 'ListEnum'"
        v-model="value"
        :state="state"
        :options="enumOptions"
        :name="field"
        :plaintext="plaintextComputed"
    />

    <b-img v-else-if="definitionField === 'Image'"
           :src="value"/>

    <!--
    Issue with radio group badly linked together when shouldn't
    For the, we need to set "name" attribute as different value for each radio-group
    -->
    <b-form-radio-group
        v-else-if="inputComponent === 'BFormRadioGroup' && definitionField === 'Enum'"
        v-model="value"
        :state="state"
        :name="formFieldComputed"
        :options="enumOptions"
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
    <bk-belongs-to-input
        v-else-if="definitionField === 'Relation'"
        v-bind="$attrs"
        :model="model"
        :field="field"
    />
    <!-- TODO: is span OK ?-->
    <span v-else-if="definitionField === 'ListValue'">
        {{model[field].join(', ')}}
    </span>

    <!-- inputText + view + ... -->
    <component
        v-else
        v-bind="$attrs"
        :is="inputComponent"
        :type="inputType"
        v-model="value"
        :model="model"
        :field="field"
        :state="state"
        :placeholder="placeholder"
        :name="field"
        :plaintext="plaintextComputed"
        :readonly="plaintextComputed"
        :options="enumOptions"
        switch
    />
  </b-input-group>
</template>

<script>
import {Class, ValidationError, ScalarField} from 'meteor/jagi:astronomy';
import Enum from "../../../../lib/modules/customFields/customs/Enum"
import I18n from "../../../../lib/classes/i18n";
import _ from "lodash";
import BkBelongsToInput from "./BkBelongsToInput";
import BkFieldList from "../forms/BkFieldList";
import BkCardListClass from "../forms/BkCardListClass";

  function isGenericInputType(originalFieldType = "") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    // Number removed, since Number authorizes decimals. Integer will use "number" input type
    return ["text", "email", "password", "search", "url", "tel", "range", "color"].includes(fieldType);

  }

  function getInheritedFieldType(originalFieldType = "") {
    let inheritedFieldType = {
      "integer": "number"
    }
    return inheritedFieldType[originalFieldType.toLowerCase()];
  }

  export default {
    name: "BkInnerInput",
    components: {BkCardListClass, BkBelongsToInput,BkFieldList},
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String,
      plaintext: Boolean,
      showAlert: Boolean
    },
    inject: ["formModel"],
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
          if (value === null || value === "") { value = undefined }
          this.model.set(this.field, value, {cast: true})
          this.model.isValid(this.field);
        },
        get: function () {
          return this.model.get(this.field);
        }
      },

      ui() {
        if (this.noUI) {return {}};
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition || !fieldDefinition.ui) {
          return {};
        }
        return fieldDefinition.ui;
      },

      formFieldComputed() {
        return this.formField && this.formField + "." + this.field || this.field;
      },

      // If for view or if readonly field, return true
      plaintextComputed() {
        if (this.$props.for === "view") {
          return true;
        }

        // isNew is only known in the formModel, not in embedded models
        let isNew = this.formModel.constructor.isNew(this.formModel);

        // Check canEdit at model level instead of traversing formModel
        // to avoid to much calculation. But, we could do this also
        // !this.formModel.canEdit(this.formField)
        if (!this.model.canEdit(this.field,isNew)) {
          return true;
        }
        return this.$props.plaintext;
      },
      required() {
        return false; //!this.model.getDefinition(this.field, "optional");
      },
      definitionField() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }
        let definitionClass = fieldDefinition.constructor.name;
        let fieldClass = fieldDefinition.type.class;
        let fieldType = fieldDefinition.type.name;
        switch (definitionClass) {
          case 'ObjectField':
            if (fieldDefinition.relation) {
              return "Relation";
            }
            return "Object";

          case 'ListField':
            if (fieldDefinition.relation) {
              return "ListRelation";
            }
            // it's a new class object
            if (Class.includes(fieldClass)) {
              return "ListClass";
            }
            // We can have a form tag since we have string values
            if (fieldDefinition.type.class.prototype instanceof String) {
              //this.value = this.value.join(", ");
              return "ListString"
            }
            if (fieldClass.name === "Enum") {
              return "ListEnum"
            }
            return "ListValue";

          case 'ScalarField':
            if (fieldDefinition.relation) {
              return "Relation";
            }
            if (fieldClass.name === "Enum") {
              return "Enum";
            }
            if (fieldClass.name === "Lifecycle") {
              return "Lifecycle";
            }
            if (fieldClass.name === "Boolean") {
              return "Boolean"
            }
            if (fieldClass.name === "Image") {
              return "Image"
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

          return getInheritedFieldType(fieldType);

        }
        return undefined;
      },
      inputComponent() {
        let fieldDefinition = this.model.getDefinition(this.field);
        // Check if field really exists :
        if (!fieldDefinition) {
          return null;
        }

        // Allow forcing template in field definition, ui part
        if (fieldDefinition.ui && fieldDefinition.ui.template) {
          return fieldDefinition.ui.template;
        }

        let fieldType = fieldDefinition.type.name;
        let templateType = fieldType.toLowerCase();
        let fieldClass = fieldDefinition.type.class.name;

        if (isGenericInputType(fieldType) || fieldType === "String") {
          return "BFormInput";
        }

        if (fieldType === "Date") {
          return "BFormDatepicker"
        }

        if (fieldType === "Time") {
          return "BFormTimepicker"
        }

        if (fieldType === "Textarea") {
          return "BFormTextarea"
        }

        // Only if Scalar field. ListEnum and ListBoolean treated differently
        if (fieldClass === "Enum") {
          if (this.plaintextComputed) {
            return "BkViewClean";
          } else {
            return "BFormRadioGroup";
          }
        }

        if (fieldClass === "Lifecycle") {
          return "BkViewClean";
        }

        if (fieldClass === "Boolean") {
          return "BFormCheckbox"
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
      placeholder() {
        return I18n.t(this.model.constructor.getPlaceHolderKey(this.field));
      },
      append() {
        let append = this.ui.append;
        if (typeof append === "function") append = append({model:this.model, field:this.field});
        if (append && append.includes(".")) return I18n.t(append);
        return append;
      },
      prepend() {
        let prepend = this.ui.prepend;
        if (typeof prepend === "function") prepend = prepend({model:this.model, field:this.field});
        if (prepend && prepend.includes(".")) return I18n.t(prepend);
        return prepend;
      },
      enumOptions() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return ;
        }
        let definitionClass = fieldDefinition.constructor.name;
        let fieldType = fieldDefinition.type.name;
        let EnumClass = fieldDefinition.type.class
        if (! Enum.enums[fieldType]) { return }
        let identifiers = EnumClass.getIdentifiers()

        let options = _.map(identifiers, x => {
              return {"text": I18n.t(EnumClass.getLabelKey(x)), "value": x}
            }
        )

        if (fieldDefinition.optional && fieldDefinition instanceof ScalarField) {
          options.splice(0,0,{ text: I18n.t("app.undefined"), value: undefined})
        }

        if (fieldDefinition.sort) {
          return options.sort((x,y) => x.text.localeCompare(y.text))
        }
        return options;
      },
      state() {
        let errors = this.model.getError(this.field);
        if (errors) {
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