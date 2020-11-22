<template>
  <div>
    <b-button
        variant="outline-secondary"
        @click="onAdd">
      <t>app.add</t>
    </b-button>

    <bk-modal :id="modalAddId" v-if="getTypeField" @ok="onSubmitModal">
      <bk-form :model="modalModel" :fields="getTypeField" :modal="true"/>
    </bk-modal>

    <b-table
        v-bind="$attrs"
        :fields="labeledFields"
        :items="items"
        :sort-by.sync="sortBySync"
        :sort-desc.sync="sortDescSync"
        sort-icon-left
        responsive
        hover
        foot-clone
        @sort-changed="onSortChange"
        no-local-sorting
    >
        <!-- header rendering and translation -->
        <template v-slot:head()="data">
          <slot name="head()" v-bind="data">
            <t>{{data.label}}</t>
          </slot>
        </template>

        <!-- action column -->
        <template v-slot:cell(buttonActions)="data">
            <bk-button-icon
                v-for="action in actions"
                :for="action"
                :model="data.item"
            />
        </template>

        <!-- default rendering -->
        <template v-slot:cell()="data">
          <slot name="cell()" v-bind="data">
            <bk-view-inner no-label :model="data.item" :field="data.field.key"/>
          </slot>
        </template>

    </b-table>
  </div>
</template>

<script>
  import { Class, ValidationError } from "meteor/jagi:astronomy";
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";
  import BkButtonIcon from "../links/BkButtonIcon";
  import BkModal from "../modals/BkModal";
  import BkForm from "../forms/BkForm";
  import BkViewInner from "../views/BkViewInner";

  export default {
    name: "BkTable",
    components: {BkButtonIcon,BkModal,BkForm,BkViewInner},
    props: {
      fields: Array,
      sortBy: String,
      sortDesc: Boolean,
      filter: Object,
      array: Array,
      model: [String,Class],
      actions: Array,
      customActions: String,
      selector: {
        type: Object,
        default: function() { return {} }
      },
      subscription: String
    },
    data() {
      return {
        sortBySync: this.sortBy,
        sortDescSync: this.sortDesc,
        datatable: new Datatable(this.$props),
        tableModel: Class.getModel(this.model),
        modalModel: undefined,
      }
    },
    computed: {
      tableClass() {
        if (typeof this.model === "string") {
          return Class.get(this.model)
        }
        return this.model;
      },
      labeledFields() {
        let headers = this.datatable.getHeaders();
        return headers;
      },
      modalAddId() {
        return 'tableModalAdd_' + this._uid;
      },
      modalModelClass() {
        return this.model.getFieldClass(this.field);
      },
      getTypeField() {
        return this.tableClass.definition.typeField;
      },
    },
    methods: {
      onSortChange(context) {
        this.datatable.setSort(context.sortBy,context.sortDesc)
      },
      onAdd() {
        //add a new model of same type afterwards
        let typefield = this.getTypeField;
        if (typefield) {
          // Ask for new model using same type field
          this.modalModel = new (this.tableClass)();
          this.$bvModal.show(this.modalAddId);
        } else {
          // TODO: Go directly on modification page or show modification modal
        }
      },
      onSubmitModal(e) {
        e.preventDefault();
        let modelClass = Class.get(this.modalModel.type);
        if (!modelClass) return;
        if (!this.modalModel.isValid(this.getTypeField)) {
          // if modal form content not valid, do not close it
          return;
        }
        // TODO !
        let routeName = this.tableClass.getName();
        let route = this.$router.resolve({name: routeName});
        if (route.resolved.matched.length > 0) {
          //the route exists, go there
          this.$router.push({
            name: routeName,
            params: {
              for: "new",
              id: this.modalModel[this.getTypeField],
            }
          })
        }
        else {
          let error = new ValidationError([{
            name: this.getTypeField,
            type: "RouteError",
            message: I18n.get("Error.missingRoute",{param: routeName})
          }])
          this.modalModel.setError(error);
          return;
        }
      },
    },
    meteor: {
      items() {
        //let selection = this.model.find(this.selector).fetch();
        //return selection;
        return this.datatable.getArray();
      }
    },
    destroyed() {
      this.datatable.stopSubscription();
    }
  }
</script>

<style scoped>

</style>