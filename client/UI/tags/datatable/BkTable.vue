<template>
  <div>
    <slot name="header" v-bind="{datatable}">
      <b-button
          variant="outline-secondary"
          @click="onAdd">
        <t>app.add</t>
      </b-button>

      <bk-modal :id="modalAddId" v-if="getTypeField" @ok="onSubmitModal">
        <bk-form :model="modalModel" :fields="getTypeField" :modal="true"/>
      </bk-modal>
    </slot>
    <slot name="main" v-bind="{items,labeledFields,datatable}">
      <table role="table" class="table b-table table-hover mt-3">
        <thead>
          <tr role="row">
            <th v-for="data in labeledFields"
                :key="data.key"
                role="columnheader"
                class="b-table-sort-icon-left"
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
                <td v-for="cell in labeledFields" :key="cell.key" role="cell">
                  <bk-button-icon
                      v-if="cell.key==='buttonActions'"
                      v-for="action in actions"
                      :for="action"
                      :model="model"
                  />
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
                      <bk-view-inner v-if="cell.key!=='buttonActions'" no-label :model="model" :field="cell.key"/>
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
    <slot name="pagination" v-bind="{items,labeledFields,datatable}">
      <div v-if="datatable.handler">
        <div v-if="datatable.firstReady">
          <div v-if="datatable.getCount()===0">
            <div class="text-center">
              <p>no data to display</p>
            </div>
          </div>
          <div v-else>
            <div v-if="scrollable()">
              <div v-if="viewScrollButton()">
                <div class="text-center">
                  <div class="btn btn-primary btn-lg">
                    <a @click="seeMore()">See More</a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Current Page: {{ datatable.page}}</p>
              <b-pagination @input="(page) => paginate(page)"
                :v-model="datatable.page"
                :total-rows="datatable.getCount()"
                :per-page="perPage"
              ></b-pagination>
            </div>
          </div>
        </div>
        <div v-else>
          <slot name="loading">
            <div class="text-center">LOADING</div>
            <div class="text-center">
              <b-spinner variant="dark" type="grow" label="Spinning"></b-spinner>
              <b-spinner variant="warning" type="grow" label="Spinning"></b-spinner>
              <b-spinner variant="danger" type="grow" label="Spinning"></b-spinner>
            </div>
          </slot>
        </div>
      </div>
      <div v-else>
        <div class="text-center">
          <div class="btn btn-primary btn-lg">
            <a @click.prevent="seeMore()">See More</a>
          </div>
        </div>
      </div>
    </slot>
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

  export default {
    name: "BkTable",
    components: {BkButtonIcon,BkModal,BkForm,BkViewInner},
    props: {
      fields: Array,
      sortBy: String,
      sortDesc: Boolean,
      perPage: Number,
      filter: Object,
      scroll: Number,
      initialFilter: Object,
      array: Array,
      model: [String,Class],
      actions: Array,
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
      routeQuery() {
        return this.$route && this.$route.query
      }
    },
    watch: {
      routeQuery(newValue, oldValue) {
        if (this.updateRoute)
          this.datatable.setContext(newValue)
      }
    },
    methods: {
      availableSlots() {
        return _omit(this.$scopedSlots,["head()","cell(buttonActions)","cell()"])
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
      onAdd() {
        //add a new model of same type afterwards
        let typefield = this.getTypeField;
        if (typefield) {
          // Ask for new model using same type field
          this.modalModel = new (this.tableClass)();
          this.$bvModal.show(this.modalAddId);
        } else {
          // TODO: Go directly on modification page or show modification modal
          let routeName = this.tableClass.getName();
          let route = this.$router.resolve({name: routeName});
          if (route.resolved.matched.length > 0) {
            //the route exists, go there
            this.$router.push({
              name: routeName,
              params: {
                for: "new",
                id: routeName,
              }
            })
          }
          else {
            let error = new ValidationError([{
              name: routeName,
              type: "RouteError",
              message: I18n.get("Error.missingRoute",{param: routeName})
            }])
            // Toast launched from $root to avoid its destruction while leaving this page
            this.$root.$bvToast.toast(I18n.get("Error.missingRoute",{param: routeName}),{
              title: I18n.t("app.failed"),
              variant: "danger",
              autoHideDelay: 5000
            })
            return;
          }
        }
      },
      onSubmitModal(e) {
        e.preventDefault();
        let modelClass = Class.get(this.modalModel.type);
        if (!modelClass) {
          let error = new ValidationError([{
            name: this.getTypeField,
            type: "TypeError",
            message: I18n.get("Error.missingSubType",{param: this.modalModel.type})
          }])
          this.modalModel.setError(error)
          return;
        }
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
      scrollable(){
        return this.$props.scroll
      },
      viewScrollButton(){
        return (this.datatable.getCount() !== this.datatable.getCountLocal())? true :  false;
      },
      seeMore(){
        let page = this.datatable.page
        this.datatable.setPage(page + 1)
      },
      paginate(page){
        this.datatable.setPage(page)
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