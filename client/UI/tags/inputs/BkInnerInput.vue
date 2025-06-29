<template>

  <b-input-group
    v-bind="$attrs"
    v-dragscroll.x="true"
    v-dragscroll.y="false"
    :prepend="prepend"
    :append="append"
    :class="inputGroupClass"
    :key="definitionKey"
  >

    <slot :name="'before-'+formGenericFieldComputed" v-bind="{...$props, ...{value,oldValue}}"/>

    <slot :name="formGenericFieldComputed"
          v-bind="{...$props,formModel, plaintext: plaintextComputed, required: !optional, placeholder, value, oldValue, append, prepend, state, options: enumOptions, class: plaintextClass}"
    >

      <bk-field-list
              v-if="definitionField === 'Object'"
              v-bind="{...$props,...$attrs,...uiComponentProps, plaintext: plaintextComputed }"
              class="col-12"
              :model="model.get(field)"
              :form-field="formFieldComputed"
              @change="$emit('change')"
              fields="">
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-field-list>

      <bk-card-list-class
          v-else-if="definitionField === 'ListClass'"
          v-bind="{...$props,...$attrs,...uiComponentProps}"
          :model="model"
          :field="field"
          :form-field="formFieldComputed">
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-card-list-class>

      <b-form-checkbox-group
          v-else-if="definitionField === 'ListEnum' && !ui.template"
          v-bind="{...$props,...$attrs,...uiComponentProps}"
          v-model="value"
          :name="field"
          :disabled="plaintextComputed"
          class="form-control-plaintext">
        <b-form-checkbox v-for="item in enumOptions"
                         :value="item.value" :key="item.value">
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
          v-bind="{...$props,...$attrs,...uiComponentProps}"
          v-model="value"
          :name="formFieldComputed"
          :key="formFieldComputed"
          :disabled="plaintextComputed"
          class="form-control-plaintext">
        <b-form-radio v-for="item in enumOptions"
                      :value="item.value" :key="item.value">
          <t>{{item.key}}</t>
        </b-form-radio>
      </b-form-radio-group>

      <b-form-tags
              v-else-if="definitionField === 'ListString'"
              v-bind="uiComponentProps"
              v-model="value"
              :state="state"
              remove-on-delete
              separator=" "
              :tag-validator="tagValidator"
              :invalid-tag-text="invalidTagText"
              :placeholder="placeholder"
              :disabled="plaintextComputed"
      >
        <template #add-button-text>
          <t>app.add</t>
        </template>
      </b-form-tags>

      <b-form-rating
          v-else-if="definitionField === 'Rating'"
          v-bind="uiComponentProps"
          v-model="value"
          :variant="ui.variant"
          :color="color"
          :readonly="plaintextComputed"
          :size="size"
          show-clear
          icon-clear="x-circle"
      />

      <bk-belongs-to-many
          v-else-if="definitionField === 'Relation'"
          v-bind="{...$attrs,...uiComponentProps}"
          v-model="value"
          :model="model"
          :field="field"
          :form-field="formFieldComputed"
          :for="$props['for']"
          :placeholder="placeholder"
          :plaintext="plaintextComputed"
          :readonly="plaintextComputed"
          :disabled="plaintextComputed"
          :max-tags="maxTags"
          @select="$emit('select',$event)"
          @input="$emit('input')"
          @ready="$emit('ready')"
          @tag="$emit('tag',$event)"
      >
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-belongs-to-many>

      <bk-belongs-to-many
        v-else-if="definitionField === 'ListRelation'"
        v-bind="{...$attrs,...uiComponentProps}"
        :model="model"
        :field="field"
        :form-field="formFieldComputed"
        :for="$props['for']"
        :plaintext="plaintextComputed"
        :readonly="plaintextComputed"
        :disabled="plaintextComputed"
        :max-tags="maxTags"
        @select="$emit('select',$event)"
        @input="$emit('input')"
        @ready="$emit('ready')"
        @tag="$emit('tag',$event)"
      >
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-belongs-to-many>
      <!-- TODO: is span OK ?-->
      <span v-else-if="definitionField === 'ListValue'">
          {{model[field].join(', ')}}
      </span>


      <!-- inputText + view + ... -->

      <component
          v-else
          v-bind="{...$attrs,...uiComponentProps}"
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
          :max-tags="maxTags"
          :debounce="debounce"
          :step="step"
          rows="3"
          max-rows="8"
      />

    </slot>

    <slot :name="'after-'+formGenericFieldComputed" v-bind="{...$props, ...{value,oldValue}}"/>

  </b-input-group>
</template>

<script>
import {Class, ValidationError, ScalarField, ObjectField, ListField, Union} from 'meteor/jagi:astronomy'
import {I18n,DateTime,Enum,Lifecycle,Image} from "meteor/akyma:bk"
import _ from "lodash";
import BkBelongsToInput from "./BkBelongsToInput";
import BkFieldList from "../forms/BkFieldList";
import BkCardListClass from "../forms/BkCardListClass";

  function isGenericInputType(originalFieldType = "") {
    let fieldType = originalFieldType.toLowerCase();
    // Field Type is a generic Input Type
    // Number removed, since Number authorizes decimals. Integer will use "number" input type
    return ["text", "email", "password", "search", "url", "tel", "date", "time", "range", "color"].includes(fieldType);

  }

  function getInheritedFieldType(originalFieldType = "") {
    let inheritedFieldType = {
      "integer": "number",
      "amount": "number"
    }
    return inheritedFieldType[originalFieldType.toLowerCase()];
  }

  export default {
    name: "BkInnerInput",
    components: {BkCardListClass, BkBelongsToInput,BkFieldList},
    props: {
      model: {
        type: Class,
        required: true
      },
      field: {
        type: String,
        required: true
      },
      formField: String,
      formGenericField: String,
      // When true, formGenericField doesn't append ".field" in computeFormGenericField
      isCompleteFormGenericField: {
        type: Boolean,
        default: false,
      },
      for: String,
      plaintext: Boolean,
      showAlert: Boolean,
      noState: {
        type: Boolean,
        default: false
      },
      validateServerSide: {
        type: Boolean,
        default: false
      }
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
          let validateServerSide = this.definition.validateServerSide || this.validateServerSide
          if (value === null || value === "") { value = undefined }
          this.model.set(this.field, value, {cast: true})
          this.model.isValid(this.field,{simulationOnly: !validateServerSide, formModel: this.formModel})
          // Avoid emit input 2 times but still needed on BkBelongsToMany tags because of filter purpose
          if (!['ListRelation','Relation'].includes(this.definitionField))
            this.$emit("input",value)
        },
        get: function () {
          let v = this.model.get(this.field)
          if (v instanceof Date && this.definition.type.name === "Date") {
            return DateTime.getISODateString(v)
          }
          return v
        }
      },
      definition() {
        let fieldDefinition = this.model.getDefinition(this.field);
        if (!fieldDefinition) {
          return {};
        }
        return fieldDefinition
      },
      fieldType() {
        return this.definition.type.name
      },
      ui() {
        if (this.noUI) {return {}}
        return this.definition.ui || {}
      },
      debounce() {
        if (this.$attrs.debounce)
          return this.$attrs.debounce
        let validateServerSide = this.definition.validateServerSide || this.validateServerSide
        if (this.definition.debounce > 0)
          return this.definition.debounce
        if (validateServerSide)
          return 250
      },
      maxTags() {
        const maxTags = this.ui.maxTags
        if (typeof maxTags === "function")
            return maxTags(this.formModel || this.model)
        return maxTags
      },
      definitionKey() {
        let key = this.definition.key
        if (typeof key === "function")
          key = key(this.formModel || this.model)
        return key
      },

      uiSwitch() {
        if (this.ui.switch === undefined) return true
        return this.ui.switch
      },

      uiComponentProps() {
        if (this.ui.props && typeof this.ui.props === "object") return this.ui.props
        return {}
      },

      formGenericFieldComputed() {
        if (this.formGenericField && this.isCompleteFormGenericField)
          return this.formGenericField
        if (this.formGenericField)
          return this.formGenericField + "." + this.field
        return this.formFieldComputed
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
        let isNew = (this.formModel) ? this.formModel.constructor.isNew(this.formModel) : this.model.constructor.isNew(this.model)

        // Check canEdit at model level instead of traversing formModel
        // to avoid too much calculation. But, we could do this also
        // !this.formModel.canEdit(this.formField)
        if (!this.model.canEdit(this.field,isNew,this.formModel)) {
          return true;
        }
        return this.$props.plaintext;
      },
      required() {
        return false; //!this.model.getDefinition(this.field, "optional");
      },
      optional() {
        if (typeof this.definition.optional === "function")
          return this.definition.optional(this.model, this.formModel)
        else
          return this.definition.optional
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
          if (fieldClass.prototype instanceof String
          || typeof fieldClass === "string"
          || fieldType === "String") {
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
          if (fieldType === "Rating") {
            return "Rating"
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

          // Field is type Date and readonly, avoiding showing jj/mm/aaaa when empty value
          if (fieldType === "Date" && this.plaintextComputed && !this.value)
            return "text"

          // Field Type is a generic Input Type
          if (isGenericInputType(fieldType)) {
            return fieldType.toLowerCase()
          }

          return getInheritedFieldType(fieldType);

        }
        return undefined;
      },
      step() {
        const steps = {
          "Amount": "0.01",
          "Number": "0.001",
          "Integer": "1"
        }
        return steps[this.fieldType]
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

        if (isGenericInputType(fieldType) || fieldType === "String" || fieldType === "TrimmedString") {
          return "BFormInput";
        }

        /*
        if (fieldType === "Date") {
          return "BFormDatepicker"
        }

        if (fieldType === "Time") {
          return "BFormTimepicker"
        }
        */

        if (fieldType === "DateTime") {
          return "BkDatePicker"
        }

        if (fieldType === "Textarea") {
          return "BFormTextarea"
        }

        if (fieldType === "TextEditor") {
          if (Meteor.isClient && this["for"]!== "view")
            return "BkTextEditor"
          else
            return "BkViewClean"
        }

        // Only if Scalar field. ListEnum and ListBoolean treated differently
        if (Enum.includes(fieldClass)) {
          if (this.plaintextComputed) {
            return "BkViewClean";
          } else {
            return "BFormRadioGroup"
          }
        }

        if (Lifecycle.includes(fieldClass)) {
          return "BkViewClean"
        }

        if (fieldType === "Boolean") {
          return "BFormCheckbox"
        }

        return "BFormInput"
      },
      plaintextClass() {
        if (this.inputComponent === "BkViewClean")
          return "form-control-plaintext"
        return ""
      },
      inputGroupClass() {
        let defaultClass = this.ui.class || ""
        if (this.$props['for'] === "filter"
        && (this.definitionField === 'ListEnum' && !this.ui.template
         || this.inputComponent === 'BFormRadioGroup')
        )
          return defaultClass + " overflow-scroll-x"
        return defaultClass
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
        if (this.plaintextComputed) return ""
        return I18n.t(this.model.constructor.getPlaceHolderKey(this.field),{ignoreNotFound: true});
      },
      append() {
        let append = this.ui.append;
        if (typeof append === "function") append = append({model:this.model, doc:this.model, parent: this.formModel, field:this.field});
        if (append && append.includes(".")) return I18n.t(append);
        return append;
      },
      prepend() {
        let prepend = this.ui.prepend;
        if (typeof prepend === "function") prepend = prepend({model:this.model, doc:this.model, parent: this.formModel, field:this.field});
        if (prepend && prepend.includes(".")) return I18n.t(prepend);
        return prepend;
      },
      enumOptions() {
        // Avoid passing an array to bkViewClean which expect an object for translations options
        if (this.plaintextComputed
            && this.inputComponent === "BkViewClean"
            && this.definitionField !== 'ListEnum'
            && !this.ui.template
        )
          return

        let fieldDefinition = this.definition

        let fieldType = fieldDefinition.type.name;
        let EnumClass = fieldDefinition.type.class
        if (! Enum.enums[fieldType]) { return }

        return EnumClass.getOptions({
          optional: this.optional && fieldDefinition instanceof ScalarField,
          sort: fieldDefinition.sort
        });
        /*
        let identifiers = EnumClass.getIdentifiers(this.formModel || this.model)

        let options = _.map(identifiers, x => {
              let key = EnumClass.getLabelKey(x);
              return {"text": I18n.t(key), key, "value": x}
            }
        )

        if (this.optional && fieldDefinition instanceof ScalarField) {
          let key = "app.undefined"
          options.splice(0,0,{ text: I18n.t(key), key, value: undefined})
        }

        if (fieldDefinition.sort) {
          return options.sort((x,y) => x.text.localeCompare(y.text))
        }

        return options;
        */
      },
      state() {
        let errors = this.model.getError(this.field);
        if (this.noState) return null
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
#filter-header div.btn-group-toggle {
  padding: 0;
}
#filter-header .input-group {
  width: auto;
}
#filter-header .btn-group-toggle label.btn {
  display: inline-block;
}

.custom-switch {
  padding-top: 0.375em;
  padding-bottom: 0.375em;
}

.overflow-scroll-x {
    overflow-x: scroll;
    overflow-y: visible;
    overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.overflow-scroll-x::-webkit-scrollbar {
    display: none;
}
</style>