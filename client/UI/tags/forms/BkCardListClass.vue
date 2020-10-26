<template>
  <div class="col-12">
  <b-card v-for="(innerModel,index) in model[field]">
    <bk-field-list
        v-bind="$attrs"
        :model="innerModel"
        :form-field="formField + '.' + index"
    />
    <b-card-footer>
      <b-button
          variant="primary"
          @click="onAdd(innerModel,index)"
      >
        <t>app.add</t>
      </b-button>
      <b-button
          variant="danger"
          @click="onRemove(innerModel,index)"
      >
        <t>app.remove</t>
      </b-button>
    </b-card-footer>
  </b-card>
  </div>
</template>

<script>
import Class from "meteor/jagi:astronomy"
import I18n from "../../../../lib/classes/i18n";

export default {
    name: "BkCardListClass",
    props: {
      model: Class,
      field: String,
      formField: String,
    },
    computed: {

    },
  methods: {
    onAdd(innerModel,index) {
      //add a new model of same type afterwards
      let modelClass = innerModel.constructor;
      this.model[this.field].splice(index+1,0,new modelClass());
    },
    onRemove(innerModel,index) {
      //remove the model
      this.model[this.field].splice(index,1);
      console.log("r");
    }
  },
  }
</script>

<style scoped>

</style>