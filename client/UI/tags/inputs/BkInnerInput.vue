<template>

  <b-input-group
    v-bind="$attrs"
    :prepend="prepend"
    :append="append"
    :class="ui.class">

    <slot :name="'before-'+formGenericFieldComputed" v-bind="$props"/>

    <slot :name="formGenericFieldComputed"
          v-bind="{...$props,...{plaintext: plaintextComputed, required, placeholder, value, append, prepend, state, options: enumOptions, class: plaintextClass}}"
    >

      <bk-field-list
              v-if="definitionField === 'Object'"
              v-bind="{...$props,...$attrs}"
              class="col-12"
              :model="model[field]"
              :form-field="formFieldComputed"
              fields="">
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-field-list>

      <bk-card-list-class
          v-else-if="definitionField === 'ListClass'"
          v-bind="{...$props,...$attrs}"
          :model="model"
          :field="field"
          :form-field="formFieldComputed">
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-card-list-class>

      <b-form-checkbox-group
          v-else-if="definitionField === 'ListEnum'"
          v-bind="{...$props,...$attrs}"
          v-model="value"
          :name="field"
          :disabled="plaintextComputed"
          class="form-control-plaintext">
        <b-form-checkbox v-for="item in enumOptions"
                         :value="item.value">
          <t>{{item.key}}</t>
        </b-form-checkbox>
      </b-form-checkbox-group>

      <b-img v-else-if="definitionField === 'Image'"
             :src="value"/>

      <!--
      Issue with radio group badly linked together when shouldn't
      So we need to set "name" attribute as different value for each radio-group
      -->
      <b-form-radio-group
          v-else-if="inputComponent === 'BFormRadioGroup' && definitionField === 'Enum'"
          v-bind="{...$props,...$attrs}"
          v-model="value"
          :name="formFieldComputed"
          :disabled="plaintextComputed"
          class="form-control-plaintext">
        <b-form-radio v-for="item in enumOptions"
                      :value="item.value">
          <t>{{item.key}}</t>
        </b-form-radio>
      </b-form-radio-group>

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
          :for="$props['for']"
          :plaintext="plaintextComputed"
          :readonly="plaintextComputed"
          :disabled="plaintextComputed"
      />

      <bk-belongs-to-many
        v-else-if="definitionField === 'ListRelation'"
        v-bind="$attrs"
        :model="model"
        :field="field"
        :for="$props['for']"
        :readonly="plaintextComputed"
        :disabled="plaintextComputed"
      />
      <!-- TODO: is span OK ?-->
      <span v-else-if="definitionField === 'ListValue'">
          {{model[field].join(', ')}}
      </span>


      <!-- inputText + view + ... -->

      <component  v-else
          v-bind="$attrs"
          :is="inputComponent"
          :class="plaintextClass"
          :type="inputType"
          v-model="value"
          @paste="onPaste"
          :model="model"
          :field="field"
          :state="state"
          :for="$props['for']"
          :placeholder="placeholder"
          :name="field"
          :plaintext="plaintextComputed"
          :readonly="plaintextComputed"
          :disabled="plaintextComputed"
          :options="enumOptions"
          :switch="uiSwitch"
      />

    </slot>

    <slot :name="'after-'+formGenericFieldComputed" v-bind="$props"/>

  </b-input-group>
</template>

<script>
import {Class, ValidationError, ScalarField, ObjectField, ListField, Union} from 'meteor/jagi:astronomy';
import Enum from "../../../../lib/modules/customFields/customs/Enum"
import Lifecycle from "../../../../lib/modules/customFields/customs/Lifecycle";
import Image from "../../../../lib/modules/customFields/classes/Image";
import I18n from "../../../../lib/classes/i18n";
import _ from "lodash";
import BkBelongsToInput from "./BkBelongsToInput";
import BkFieldList from "../forms/BkFieldList";
import BkCardListClass from "../forms/BkCardListClass";

  function isGenericInputType(originalFieldType = "") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    // Number removed, since Number authorizes decimals. Integer will use "number" input type
    return ["text", "email", "password", "search", "url", "tel", "time", "range", "color"].includes(fieldType);

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
      formGenericField: String,
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
          this.$emit("input",value)
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

      uiSwitch() {
        if (this.ui.switch === undefined) return true
        return this.ui.switch
      },

      formGenericFieldComputed() {
        if (this.formGenericField) return this.formGenericField + "." + this.field;
        return this.formFieldComputed;
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
      getUnionTypes() {
        let fieldDefinition = this.model.getDefinition(this.field);
        let fieldType = fieldDefinition.type.name;
        if (Object.keys(Union.unions).includes(fieldType)) {
          return fieldDefinition.type.class.types
        }
        return []
      },
      definitionField() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return null;
        }
        // let definitionClass = fieldDefinition.constructor.name;
        let fieldClass = fieldDefinition.type.class;
        let fieldType = fieldDefinition.type.name;

        /* Object fields - subclasses */
        if (fieldDefinition instanceof ObjectField) {
          if (fieldDefinition.relation) {
            return "Relation";
          }
          return "Object";
        }

        /* List fields */
        if (fieldDefinition instanceof ListField) {
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
          if (Enum.includes(fieldClass)) {
            return "ListEnum"
          }
          return "ListValue";
        }

        /* Scalar fields */
        if (fieldDefinition instanceof ScalarField) {
          if (fieldDefinition.relation) {
            return "Relation";
          }
          if (Enum.includes(fieldClass)) {
            return "Enum";
          }
          if (Lifecycle.includes(fieldClass)) {
            return "Lifecycle";
          }
          if (fieldType === "Boolean") {
            return "Boolean"
          }
          if (fieldType === "Image") {
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
        let fieldClass = fieldDefinition.type.class;

        if (isGenericInputType(fieldType) || fieldType === "String") {
          return "BFormInput";
        }

        if (fieldType === "Date") {
          return "BFormDatepicker"
        }

        if (fieldType === "Time") {
          return "BFormTimepicker"
        }

        if (fieldType === "DateTime") {
          return "BkDatePicker";
        }

        if (fieldType === "Textarea") {
          return "BFormTextarea"
        }

        // Only if Scalar field. ListEnum and ListBoolean treated differently
        if (Enum.includes(fieldClass)) {
          if (this.plaintextComputed) {
            return "BkViewClean";
          } else {
            return "BFormRadioGroup";
          }
        }

        if (Lifecycle.includes(fieldClass)) {
          return "BkViewClean";
        }

        if (fieldType === "Boolean") {
          return "BFormCheckbox"
        }

        return "BFormInput";
      },
      plaintextClass() {
        if (this.inputComponent === "BkViewClean")
          return "form-control-plaintext"
        return ""
      },
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
      },
      onPaste(e) {
        if (this.ui.preventPaste) e.preventDefault();
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

        let fieldType = fieldDefinition.type.name;
        let EnumClass = fieldDefinition.type.class
        if (! Enum.enums[fieldType]) { return }
        let identifiers = EnumClass.getIdentifiers()

        let options = _.map(identifiers, x => {
              let key = EnumClass.getLabelKey(x);
              return {"text": I18n.t(key), key, "value": x}
            }
        )

        if (fieldDefinition.optional && fieldDefinition instanceof ScalarField) {
          let key = "app.undefined"
          options.splice(0,0,{ text: I18n.t(key), key, value: null})
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