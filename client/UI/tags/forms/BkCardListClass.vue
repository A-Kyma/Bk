<template>
  <div ref="parent" class="col-12 d-block">
    <b-row class="mb-2" v-if="$props['for'] !== 'view'">
      <b-col v-if="getTypeField">
        <b-form-select v-model="insertModel.selected">
          <b-form-select-option v-for="option in enumOptions"
                                :key="option.key"
                                :value="option.value">
            <t>{{option.key}}</t>
          </b-form-select-option>
        </b-form-select>
      </b-col>
      <b-col v-if="!$attrs.noNumber">
        <b-form-input type="number" v-model="insertModel.number"/>
      </b-col>
      <b-col>
        <b-button
            variant="outline-secondary"
            @click="onAddSubClass(0)">
          <t>app.add</t>
        </b-button>
      </b-col>
    </b-row>

    <Container
      ref="container"
      behaviour="move"
      drag-class="card-ghost bg-warning"
      drop-class="card-ghost-drop"
      @drop="onDrop"
      :get-ghost-parent="getGhostParent"
    >

      <Draggable
        v-for="(innerModel,index) in model[field]"
        :key="innerModel._id.valueOf()"
        class="overflow-visible"
      >
        <b-card
            class="border mb-2 drag-hover"
            body-class="pt-2 pl-2 pr-4 pb-0"
        >
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
              :exclude="['isActive',getTypeField]">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-field-list>
          <bk-button-icon
              v-if="!getTypeField && canDelete"
              @click="onRemove(index)"
              icon="trash-fill"
              variant="danger"
              class="remove-button"
          />

          <!--
          <b-card-footer v-if="$props['for'] !== 'view'">
            <b-button
                variant="outline-secondary"
                @click="onAdd(index+1,innerModel)"
            >
              <t>app.add</t>
            </b-button>
          </b-card-footer>
          -->
        </b-card>
      </Draggable>
    </Container>
    <!--
    <b-button
        v-if="model[field].length === 0 && $props['for'] !== 'view'"
        variant="outline-secondary"
        @click="onAdd(0)">
      <t>app.add</t>
    </b-button>

    <bk-modal :id="modalId" v-if="getTypeField" @ok="onSubmitModal">
      <bk-input :model="modalModel" :field="getTypeField"/>
    </bk-modal>
    -->
    <b-row class="mt-2" v-if="model[field].length>0 && $props['for'] !== 'view'">
      <b-col v-if="getTypeField">
        <b-form-select v-model="insertModel.selected">
          <b-form-select-option v-for="option in enumOptions"
                                :key="option.key"
                                :value="option.value">
            <t>{{option.key}}</t>
          </b-form-select-option>
        </b-form-select>
      </b-col>
      <b-col v-if="!$attrs.noNumber">
        <b-form-input type="number" v-model="insertModel.number"/>
      </b-col>
      <b-col>
        <b-button
            variant="outline-secondary"
            @click="onAddSubClass(-1)">
          <t>app.add</t>
        </b-button>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { Enum } from "meteor/akyma:bk"
import BkButtonIcon from "../links/BkButtonIcon";
import BkFieldList from "./BkFieldList";
import BkModal from "../modals/BkModal";
import BkInput from "../inputs/BkInput";
import BkViewClean from "../views/BkViewClean";
import { Container, Draggable } from "@akyma/vue-smooth-dnd";
import applyDrag from "../../../utils/applyDrag";

export default {
    name: "BkCardListClass",
    components: {BkButtonIcon,BkFieldList,BkModal,BkInput,BkViewClean,Container,Draggable},
    props: {
      model: Class,
      field: String,
      formField: String,
      for: String
    },
  data() {
    return {
      hoverTrashIcon: false,
      modalModel: undefined,
      indexToAdd: 0,
      insertModel: {
        selected: undefined,
        number: 1,
      },
    }
  },
  computed: {
    getTypeField() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass.definition.typeField;
    },
    /* @deprecated */
    modalId() {
      return this.field + '_' + this._uid;
    },
    /* @deprecated */
    modalModelClass() {
      return this.model.getFieldClass(this.field);
    },
    canDelete() {
      if (this.$props.for === "view") return false;
      return this.model.canUpdate(this.field);
    },
    enumOptions() {
      let subclass = this.model.getFieldClass(this.field);
      if (!subclass?.definition?.typeField) return
      let fieldDefinition = subclass.getDefinition(subclass.definition.typeField);
      if (!fieldDefinition) return

      let fieldType = fieldDefinition.type.name;
      let EnumClass = fieldDefinition.type.class
      if (! Enum.enums[fieldType]) { return }
      return EnumClass.getOptions();
    },
  },
  methods: {
    onAddSubClass(index) {
      if (index === -1) index = this.model[this.field].length

      let typefield = this.getTypeField;
      for (let i=0; i<this.insertModel.number; i++) {
        let innerModel;
        if (typefield) {
          if (!this.insertModel.selected) return
          innerModel = Class.get(this.insertModel.selected);
        }
        else
          innerModel = this.model.getFieldClass(this.field);

        const newInner = new innerModel()
        newInner._getParent = () => this.model
        this.model[this.field].splice(index,0,newInner);
      }
      this.insertModel.selected = undefined
      this.insertModel.number = 1
    },
    /* @deprecated */
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
    },
    /* @deprecated */
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    },
    /* @deprecated */
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
    /* @deprecated */
    getIndexForModel(innerModel,index) {
      let typeField = this.getTypeField;
      // TODO: Can't to this, this filter the original Array in this.model !
      this.model[this.field].filter((x) => {
        x[typeField] = innerModel[typeField]
      })
      return index;
    },
    getGhostParent() {
      return document.body
    },
    onDrop(e) {
      applyDrag(this.model[this.field],e)
    }
  },
}
</script>

<style scoped>
.remove-button {
  position: absolute;
  top: 2px;
  right: 4px;
}
.drag-hover:hover {
  cursor: grab;
}
.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(1deg);
  cursor: grabbing;
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
  cursor: grab;
}
/* Drag&Drop prevent drop down to be shown from BkBelongsToMany tag => VueMultiSelect */
.overflow-visible {
  overflow: visible !important;
}
</style>