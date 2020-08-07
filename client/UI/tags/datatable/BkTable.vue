<template>
    <b-table v-bind="$attrs" :fields="labeledFields" :items="items" responsive hover foot-clone>
        <!-- default rendering -->
        <template v-slot:cell()="data">
            <bk-view-inner no-label :model="data.item" :field="data.field.key"/>
        </template>

        <!-- action column -->
        <template v-:slot:cell(action)="data">
            Action column
        </template>
    </b-table>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy";
  import {Bk} from "../../../../lib/lib.js"
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";

  export default {
    name: "BkTable",
    props: {
      fields: Array,
      array: Array,
      model: [String,Class],
      selector: {
        type: Object,
        default: function() { return {} }
      },
      subscription: String
    },
    data() {
      return {
        datatable: new Datatable(this.$props),
      }
    },
    computed: {
      labeledFields() {
        return this.fields;
      }
    },
    meteor: {
      items() {
        let selection = this.model.find(this.selector).fetch();
        return selection;
      }
    },
  }
</script>

<style scoped>

</style>