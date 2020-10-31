<template>
  <div class="col-12">
    <b-button
        variant="outline-primary"
        @click="onAdd()">
      <t>app.add</t>
    </b-button>
    <b-card v-for="(innerModel,index) in model[field]">
      <b-card-header v-if="getTypeField">
        <bk-button-icon
            v-if="canDelete"
            @click="onRemove(innerModel,index)"
            icon="trash-2-fill"
            variant="danger"
        />

        <bk-view-clean
            v-bind="$attrs"
            :model="innerModel"
            :field="getTypeField"
            :form-field="formField + '.' + index"
        />

        <bk-input
            v-if="innerModel.getDefinition('isActive')!==undefined"
            :model="innerModel"
            field="isActive"
            :form-field="formField + '.' + index"
        />

      </b-card-header>
      <bk-field-list
          v-if="innerModel.getDefinition('isActive')===undefined || innerModel.isActive"
          v-bind="$attrs"
          :model="innerModel"
          :form-field="formField + '.' + index"
          :exclude="[getTypeField,'isActive']"
      />
    </b-card>
    <b-button
        variant="outline-primary"
        @click="onAdd()">
      <t>app.add</t>
    </b-button>

    <bk-modal :id="modalId" v-if="getTypeField" @ok="onSubmitModal">
      <bk-input :model="innerModel" :field="getTypeField"/>
    </bk-modal>

  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import I18n from "../../../../lib/classes/i18n";
import BkButtonIcon from "../links/BkButtonIcon";
import BkFieldList from "./BkFieldList";

export default {
    name: "BkCardListClass",
    components: {BkButtonIcon,BkFieldList},
    props: {
      model: Class,
      field: String,
      formField: String,
    },
  data() {
    return {
      hoverTrashIcon: false,
      innerModel: undefined
    }
  },
  computed: {
    getTypeField() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass.definition.typeField;
    },
    modalId() {
      return this.field + '_' + this._uid;
    },
    innerModelClass() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass;
    },
    canDelete() {
      return this.model.canDelete(this.field);
    }
  },
  methods: {
    onAdd(innerModel,index) {
      //add a new model of same type afterwards
      this.innerModel = new (this.innerModelClass)();
      this.$bvModal.show(this.modalId);
      /*
      let modelClass = innerModel.constructor;
      this.model[this.field].splice(index,0,new modelClass());
       */
    },
    onRemove(innerModel,index) {
      //remove the model
      this.model[this.field].splice(index,1);
      console.log("r");
    },
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    },
    onSubmitModal(e) {
      let modelClass = Class.get(this.innerModel.type);
      if (!modelClass) return;
      if (!this.innerModel.isValid(this.getTypeField)) {
        // if modal form content not valid, do not close it
        e.preventDefault();
        return;
      }
      this.model[this.field].push(new modelClass());
    }
  },
  }
</script>

<style scoped>

</style>