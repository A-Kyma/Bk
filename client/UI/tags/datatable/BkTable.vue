<template>
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
          <t>{{data.label}}</t>
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
            <bk-view-inner no-label :model="data.item" :field="data.field.key"/>
        </template>

    </b-table>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy";
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";
  import BkButtonIcon from "../links/BkButtonIcon";

  export default {
    name: "BkTable",
    components: {BkButtonIcon},
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
      }
    },
    computed: {
      labeledFields() {
        let headers = this.datatable.getHeaders();
        return headers;
      }
    },
    methods: {
      onSortChange(context) {
        this.datatable.setSort(context.sortBy,context.sortDesc)
      }
    },
    meteor: {
      items() {
        //let selection = this.model.find(this.selector).fetch();
        //return selection;
        return this.datatable.getArray();
      }
    }
  }
</script>

<style scoped>

</style>