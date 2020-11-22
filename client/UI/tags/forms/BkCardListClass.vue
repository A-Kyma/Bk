<template>
  <div class="col-12">
    <b-card v-for="(innerModel,index) in model[field]" :key="innerModel._id.valueOf()">
      <b-card-header v-if="getTypeField">


        <bk-view-clean
            v-bind="$attrs"
            :model="innerModel"
            :field="getTypeField"
            :form-field="formField + '.' + index"
            :form-generic-field="formField"
        />

        <bk-button-icon
                v-if="canDelete"
                @click="onRemove(index)"
                icon="trash-fill"
                variant="danger"
        />
        <!--{{getIndexForModel(innerModel,index)}}-->

        <bk-input
            v-if="innerModel.getDefinition('isActive')!==undefined"
            :model="innerModel"
            field="isActive"
            :for="$props['for']"
            :form-field="formField + '.' + index"
            :form-generic-field="formField"
        />

      </b-card-header>
      <bk-field-list
          v-if="innerModel.getDefinition('isActive')===undefined || innerModel.isActive"
          v-bind="$attrs"
          :for="$props['for']"
          :model="innerModel"
          :form-field="formField + '.' + index"
          :form-generic-field="formField"
          :exclude="[getTypeField,'isActive']">

        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>

      </bk-field-list>

      <b-card-footer v-if="$props['for'] !== 'view'">
        <b-button
            variant="outline-secondary"
            @click="onAdd(index+1,innerModel)"
        >
          <t>app.add</t>
        </b-button>
      </b-card-footer>
    </b-card>
    <b-button
        v-if="model[field].length === 0 && $props['for'] !== 'view'"
        variant="outline-secondary"
        @click="onAdd(0)">
      <t>app.add</t>
    </b-button>

    <bk-modal :id="modalId" v-if="getTypeField" @ok="onSubmitModal">
      <bk-input :model="modalModel" :field="getTypeField"/>
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
      for: String,
    },
  data() {
    return {
      hoverTrashIcon: false,
      modalModel: undefined,
      indexToAdd: 0,
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
    modalModelClass() {
      return this.model.getFieldClass(this.field);
    },
    canDelete() {
      if (this.$props.for === "view") return false;
      return this.model.canDelete(this.field);
    },
  },
  methods: {
    onAdd(index,innerModel) {
      //add a new model of same type afterwards
      let typefield = this.getTypeField;
      if (typefield) {
        this.indexToAdd = index;
        // Ask for new model using same type field
        this.modalModel = new (this.modalModelClass)();
        this.modalModel[typefield] = innerModel[typefield];
        this.$bvModal.show(this.modalId);
      } else {
        this.modalModel = new (this.modalModelClass)();
        this.model[this.field].splice(index,0,this.modalModel)
      }
    },
    onRemove(index) {
      //remove the model
      this.model[this.field].splice(index,1);
      console.log("r");
    },
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    },
    onSubmitModal(e) {
      let modelClass = Class.get(this.modalModel.type);
      if (!modelClass) return;
      if (!this.modalModel.isValid(this.getTypeField)) {
        // if modal form content not valid, do not close it
        e.preventDefault();
        return;
      }
      this.model[this.field].splice(this.indexToAdd,0,new modelClass());
    },
    getIndexForModel(innerModel,index) {
      let typeField = this.getTypeField;
      // TODO: Can't to this, this filter the original Array in this.model !
      this.model[this.field].filter((x) => {
        x[typeField] = innerModel[typeField]
      })
      return index;
    }
  },
  }
</script>

<style scoped>

</style>