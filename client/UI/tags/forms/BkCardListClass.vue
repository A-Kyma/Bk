<template>
  <div class="col-12">
    <b-button
        variant="outline-primary"
        @click="onAdd()"
    >
      <t>app.add</t>
    </b-button>
  <b-card v-for="(innerModel,index) in model[field]">
    <b-card-header v-if="getTypeField">
      <bk-button-icon
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

    </b-card-header>
    <bk-field-list
        v-bind="$attrs"
        :model="innerModel"
        :form-field="formField + '.' + index"
        :exclude="getTypeField"
    />
  </b-card>
      <b-button
          variant="outline-primary"
          @click="onAdd()"
      >
        <t>app.add</t>
      </b-button>
  </div>
</template>

<script>
import Class from "meteor/jagi:astronomy"
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
    }
  },
  computed: {
    getTypeField() {
      let definition = this.model.getDefinition(this.field);
      let subClass = definition.type.class;
      return subClass.definition.typeField;
    }
  },
  methods: {
    onAdd(innerModel,index) {
      //add a new model of same type afterwards
      let modelClass = innerModel.constructor;
      this.model[this.field].splice(index,0,new modelClass());
    },
    onRemove(innerModel,index) {
      //remove the model
      this.model[this.field].splice(index,1);
      console.log("r");
    },
    onHoverTrashIcon(hovered) {
      this.hoverTrashIcon = hovered;
    }
  },
  }
</script>

<style scoped>

</style>