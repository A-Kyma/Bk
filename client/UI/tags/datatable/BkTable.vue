<template>
  <div>
    <slot name="header" v-bind="{datatable, model, actions}">
      <bk-button-icon v-if="actions.includes('add')"
                      label="app.add"
                      for="add"
                      :model="model"
                      :params="filter"
                      :fields="modalFields"
                      :exclude="modalExclude"
                      v-bind="$attrs"
      >
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-button-icon>
      <bk-button-icon v-if="actions.includes('back')"
                      label="app.back"
                      for="back"
                      v-bind="$attrs"
      />
    </slot>
    <slot name="customHeader" v-bind="{datatable, model, actions}"/>
    <br/>
    <div v-if="datatable.handler">
      <div v-if="datatable.firstReady">
        <slot name="pagination-top" v-bind="{datatable, scroll, perPage}">
          <bk-pagination
              v-if="!full && !scroll"
              :datatable="datatable"
              :scroll="scroll"
              :perPage="perPage"
              :updateRoute="updateRoute"
          />
        </slot>
      </div>
      <div v-else>
        <slot name="loading-top">
          <bk-loading/>
        </slot>
      </div>
    </div>
    <slot name="main" v-bind="{items,labeledFields,datatable, model, actions}">
      <table role="table" class="table b-table table-hover mt-3">
        <thead>
          <tr role="row">
            <th v-for="data in labeledFields"
                :key="data.key"
                role="columnheader"
                class="b-table-sort-icon-left align-middle"
                :aria-sort="datatable.getAriaSort(data.key)"
                @click="onSort(data.key)"
            >
              <slot :name="'head('+data.key+')'" v-bind="{field:data.key}">
                <slot name="head()" v-bind="{field:data.key}">
                  <t>{{data.label}}</t>
                </slot>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <template v-for="(model,index) in items">
            <tr role="row" :key="model._id">
              <slot name="row()" v-bind="{model,index,fields: labeledFields}">
                <td v-for="cell in labeledFields" :key="cell.key" role="cell" class="align-middle">
                  <bk-button-icon
                      v-if="cell.key==='buttonActions'"
                      v-for="action in actions.filter(x=>!['add','back'].includes(x))"
                      :for="action"
                      :model="model"
                      :fields="modalFields"
                      :exclude="modalExclude"
                      v-bind="$attrs"
                      @remove="onRemove"
                  >
                    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                      <slot :name="slot" v-bind="props" />
                    </template>
                  </bk-button-icon>
                  <slot
                      v-if="cell.key==='buttonActions'"
                      name="customActions"
                      v-bind="{model, index, field: cell.key}"
                  />
                  <slot
                      v-if="cell.key!=='buttonActions'"
                      :name="'cell('+cell.key+')'"
                      v-bind="{model, index, field: cell.key}">
                    <slot name="cell()" v-bind="{model,index,field: cell.key}">
                      <bk-view-inner v-if="!datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" no-label :model="model" :field="cell.key"/>
                      <bk-inner-input v-else-if="datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" :model="model" :field="cell.key"/>
                    </slot>
                  </slot>
                </td>
              </slot>
            </tr>
            <slot name="afterRow" v-bind="{model, index}"/>
          </template>
        </tbody>
      </table>
    </slot>
    <div v-if="datatable.handler">
      <div v-if="datatable.firstReady">
        <slot name="pagination-bottom" v-bind="{datatable, scroll, perPage}">
          <bk-pagination
              v-if="!full"
              :datatable="datatable"
              :scroll="scroll"
              :perPage="perPage"
              :updateRoute="updateRoute"
          >
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-pagination>
        </slot>
      </div>
      <div v-else>
        <slot name="loading-bottom">
          <bk-loading/>
        </slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
  import { Class, ValidationError } from "meteor/jagi:astronomy";
  import _omit from "lodash/omit";
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";
  import BkButtonIcon from "../links/BkButtonIcon";
  import BkModal from "../modals/BkModal";
  import BkForm from "../forms/BkForm";
  import BkViewInner from "../views/BkViewInner";
  import BkPagination from "./BkPagination";
  import BkLoading from "../loading/BkLoading";

  export default {
    name: "BkTable",
    components: {BkPagination, BkButtonIcon,BkModal,BkForm,BkViewInner},
    props: {
      fields: Array,
      exportFields: String,
      editableFields: [String,Array],
      modalFields: [String,Array],
      modalExclude: [String,Array],
      sort: {
        type: Object,
      },
      sortBy: String,
      sortDesc: Boolean,
      perPage: Number,
      page: Number,
      filter: Object, // default filter used, cannot be changer afterwards
      initialFilter: Object, // initial applied filter, can be changed at any time using table filters
      scroll: Boolean,
      multi: Boolean,
      full: Boolean,
      array: Array,
      model: [String,Class],
      actions: {
        type: Array,
        default: function() {return []}
      },
      customActions: String,
      selector: {
        type: Object,
        default: function() { return {} }
      },
      subscription: String,
      updateRoute: Boolean
    },
    data() {
      return {
        sortBySync: this.sortBy,
        sortDescSync: this.sortDesc,
        datatable: new Datatable(this),
        tableModel: Class.getModel(this.model),
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
      routeQuery() {
        return this.$route && this.$route.query
      },
      firstReady() {
        return this.datatable.firstReady
      }
    },
    watch: {
      routeQuery(newValue, oldValue) {
        if (this.updateRoute)
          this.datatable.setContext(newValue)
      },
    },
    methods: {
      availableSlots() {
        return _omit(this.$scopedSlots, ["head()", "cell(buttonActions)", "cell()"])
      },
      onSort(field) {
        this.datatable.updateSort(field);
      },
      onContextChange(context) {
        if (this.updateRoute)
          this.$router.push({name: this.$route.name, query: context})
        else
          this.datatable.setContext(context);
      },
      onRemove(subModel) {
        this.$emit("remove",subModel)
      }
    },
    meteor: {
      items() {
        //let selection = this.model.find(this.selector).fetch();
        //return selection;
        return this.datatable.getArray();
      },
    },
    destroyed() {
      this.datatable.stopSubscription();
    }
  }
</script>

<style scoped>

</style>