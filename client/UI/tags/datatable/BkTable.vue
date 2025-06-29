<template>
  <div class="m-2">
    <slot name="header" v-bind="{datatable, model, actions}">
      <slot name="customFrontHeader" v-bind="{datatable, model, actions}"/>
      <bk-button-icon v-if="actions.includes('back')"
                      label="app.back"
                      for="back"
                      v-bind="$attrs"
      />
      <b-button  v-if="filterButton && filterFields" v-b-toggle.filter-collapse size="md" class="">
        <b-icon icon="filter-circle-fill" aria-hidden="true"></b-icon>
      </b-button>
      <bk-button-icon v-if="actions.includes('add')"
                      label="app.add"
                      for="add"
                      :model="model"
                      :params="filter"
                      :fields="modalFields"
                      :exclude="modalExclude"
                      @tag="$emit('tag',$event)"
                      v-bind="$attrs"
      >
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" />
        </template>
      </bk-button-icon>
      <bk-export-to-xlsx-button
        v-if="actions.includes('export')"
        from-bk-table
        :params="{...filter,...datatable.filters}"
        @export="datatable.exportToCsv()"
        v-bind="$attrs"
      />
<!--      <bk-button-icon v-if="actions.includes('export')"-->
<!--                      label="app.export"-->
<!--                      for="export"-->
<!--                      v-bind="$attrs"-->
<!--      />-->
      <bk-button-icon v-if="actions.includes('import')"
                      label="app.import.btn.label"
                      for="import"
                      v-bind="$attrs"
                      :model="model"
                      :import-file-type="importFileType"
      />
    </slot>
    <slot name="customHeader" v-bind="{datatable, model, actions}"/>
    <slot name="filterHeader" v-bind="{datatable,model,actions}">
      <slot name="beforeFilter" v-bind="{datatable,model,actions}"/>
      <b-collapse v-if="filterButton && filterFields" id="filter-collapse">
      <b-form v-if="filterFields"
              @submit="onSubmitFormFilter"
              @reset="onResetFormFilter"
              id="filter-header"
              inline
              class="mt-2 mb-1"
      >
        <b-input-group
            v-for="field of filterFields"
            class="mb-2 mr-sm-2 mb-sm-0 flex-nowrap max100vw"
        >
          <template #prepend v-if="!noFilterLabel">

            <slot :name="'prependFilter-'+field" v-bind="{datatable,model,field,label:datatable.filterModel.constructor.getLabelKey(field)}">
              <slot name="prependFilter" v-bind="{datatable,model,field,label: datatable.filterModel.constructor.getLabelKey(field)}">
                <b-input-group-text>
                  <t>{{datatable.filterModel.constructor.getLabelKey(field)}}</t>
                </b-input-group-text>
              </slot>
            </slot>

          </template>
          <bk-inner-input
              :model="datatable.filterModel"
              :field="field"
              for="filter"
              form-field="filter"
              :buttons="true"
              button-variant="outline-primary"
              @change="onAutoFilterSubmit($event,field)"
              @input="onAutoFilterSubmit($event,field)"
              @ready="$emit('filterReady',field)"
              debounce="250"
          >
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-inner-input>
        </b-input-group>
        <b-button v-if="!noFilterReset" type="reset" variant="outline-dark" class="mr-2"><t>app.reset</t></b-button>
        <b-button v-if="!autoFilterSubmit" type="submit" variant="outline-primary"><t>app.filter</t></b-button>
        <slot name="afterFilterButtons" v-bind="{datatable,model}"/>
      </b-form>
      </b-collapse>
      <div v-else>
      <b-form v-if="filterFields"
              @submit="onSubmitFormFilter"
              @reset="onResetFormFilter"
              id="filter-header"
              inline
              class="mt-2 mb-1"
      >
        <b-input-group
            v-for="field of filterFields"
            class="mb-2 mr-sm-2 mb-sm-0 flex-nowrap max100vw"
        >
          <template #prepend v-if="!noFilterLabel">

            <slot :name="'prependFilter-'+field" v-bind="{datatable,model,field,label:datatable.filterModel.constructor.getLabelKey(field)}">
              <slot name="prependFilter" v-bind="{datatable,model,field,label: datatable.filterModel.constructor.getLabelKey(field)}">
                <b-input-group-text>
                  <t>{{datatable.filterModel.constructor.getLabelKey(field)}}</t>
                </b-input-group-text>
              </slot>
            </slot>

          </template>
          <bk-inner-input
              :model="datatable.filterModel"
              :field="field"
              for="filter"
              form-field="filter"
              :buttons="true"
              button-variant="outline-primary"
              @change="onAutoFilterSubmit($event,field)"
              @input="onAutoFilterSubmit($event,field)"
              @ready="$emit('filterReady',field)"
              debounce="250"
          >
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-inner-input>
        </b-input-group>
        <b-button v-if="!noFilterReset" type="reset" variant="outline-dark" class="mr-2"><t>app.reset</t></b-button>
        <b-button v-if="!autoFilterSubmit" type="submit" variant="outline-primary"><t>app.filter</t></b-button>
        <slot name="afterFilterButtons" v-bind="{datatable,model}"/>
      </b-form>
      </div>
    </slot>
    <div v-if="datatable.handler">
      <div v-if="datatable.firstReady">
        <slot name="pagination-top" v-bind="{datatable, scroll, perPage}">
          <bk-pagination
              v-if="!full && !scroll && count!==0 && !noPagination"
              :datatable="datatable"
              :scroll="scroll"
              :perPage="datatable.perPage"
              :updateRoute="updateRoute"
              :count="count"
              @page-click="$emit('page-click',$event)"
          />
        </slot>
      </div>
      <div v-else>
        <slot name="loading-top">
          <div> </div>
        </slot>
      </div>
    </div>
    <slot name="main" v-bind="{items,count,labeledFields,datatable, model, actions, filterModel: datatable.filterModel}">
      <div v-if="cardMode">
        <b-card
            v-for="(model,index) in items"
            class="mt-2 mb-2"
            @click="$emit('row-clicked',model)"
            :key="model._id">
          <template #header>
            <span class="mr-2">
              <slot name="cardheader" v-bind="{model,index,fields: labeledFields}">
                {{model.defaultName()}}
              </slot>
            </span>
            <bk-button-icon
                v-for="action in actions.filter(x=>!['add','back','export','import','custom'].includes(x))"
                :for="action"
                :model="model"
                :fields="modalFields"
                :exclude="modalExclude"
                v-bind="$attrs"
                @remove="onRemove"
                @tag="$emit('tag',$event)"
                class="float-right"
            >
              <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                <slot :name="slot" v-bind="props" />
              </template>
            </bk-button-icon>
            <slot
                name="customActions"
                v-bind="{model, index, cardMode}"
            />
          </template>
          <b-card-text role="row" :key="model._id">
            <slot name="row()" v-bind="{model,index,fields: labeledFields, cardMode}">
              <div v-for="cell in labeledFields" :key="cell.key" role="cell" class="align-middle">
                <slot
                    v-if="cell.key!=='buttonActions'"
                    :name="'cell('+cell.key+')'"
                    v-bind="{model, index, field: cell.key, cardMode}">
                  <slot name="cell()" v-bind="{model,index,field: cell.key, cardMode}">
                    <span v-if="!datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'">
                      <bk-view-inner :no-label="!cardWithLabel" :model="model" :field="cell.key"/>
                    </span>
                    <span v-else-if="datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'">
                      <bk-input
                          v-if="cardWithLabel"
                          :model="model"
                          :field="cell.key"
                          :form-generic-field="'cell('+cell.key+')'"
                          is-complete-form-generic-field
                          label-cols
                          debounce="500"
                          @input="onAutoFieldSubmit(model,cell.key)"
                      >
                        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                          <slot :name="slot" v-bind="props" />
                        </template>
                      </bk-input>
                      <bk-inner-input
                          v-else
                          :model="model"
                          :field="cell.key"
                          :form-generic-field="'cell('+cell.key+')'"
                          is-complete-form-generic-field
                          debounce="500"
                          @input="onAutoFieldSubmit(model,cell.key)"
                      >
                        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                          <slot :name="slot" v-bind="props" />
                        </template>
                      </bk-inner-input>
                    </span>
                  </slot>
                </slot>
              </div>
            </slot>
          </b-card-text>
          <slot name="afterRow" v-bind="{model, index}"/>
        </b-card>
      </div>
      <table v-else role="table" :class="'table b-table table-hover mt-3 ' + tblClass">
        <slot name="tableHead" v-bind="{items,labeledFields,datatable, model, actions}">
          <thead>
            <tr role="row">
              <th v-if="draggable"><t>app.drag.order.title</t></th>
              <th v-for="data in labeledFields"
                  :key="data.key"
                  role="columnheader"
                  :class="'b-table-sort-icon-left align-middle ' + data.key"
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
        </slot>
        <template v-if="draggable">
           <Container @drop="onDrop"
                      drag-class="card-ghost bg-warning"
                      drop-class="card-ghost-drop"
                      :tag="{value: 'tbody', props: {role: 'rowgroup'}}"
                      lock-axis="y">
             <Draggable v-for="(model,index) in items" :key="model._id" :tag="{value: 'tr', props: {role: 'row'}}">
                 <slot name="row()" v-bind="{model,index,fields: labeledFields, cardMode}">
                   <td role=cell :class="'align-middle ' + tdClass" style="cursor: pointer"><b-icon icon="arrows-move" aria-hidden="true"></b-icon></td>
                   <td v-for="cell in labeledFields" :key="cell.key" role="cell" :class="'align-middle ' + tdClass">
                     <bk-button-icon
                         v-if="cell.key==='buttonActions'"
                         v-for="action in actions.filter(x=>!['add','back','export','import','custom'].includes(x))"
                         :for="action"
                         :model="model"
                         :fields="modalFields"
                         :exclude="modalExclude"
                         v-bind="$attrs"
                         @tag="$emit('tag',$event)"
                         @remove="onRemove"
                     >
                       <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                         <slot :name="slot" v-bind="props" />
                       </template>
                     </bk-button-icon>
                     <slot
                         v-if="cell.key==='buttonActions'"
                         name="customActions"
                         v-bind="{model, index, field: cell.key, cardMode}"
                     />
                     <slot
                         v-if="cell.key!=='buttonActions'"
                         :name="'cell('+cell.key+')'"
                         v-bind="{model, index, field: cell.key, cardMode}">
                       <slot name="cell()" v-bind="{model,index,field: cell.key, cardMode}">
                         <bk-view-inner v-if="!datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" no-label :model="model" :field="cell.key"/>
                         <bk-inner-input
                             v-else-if="datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'"
                             :model="model"
                             :field="cell.key"
                             :form-generic-field="'cell('+cell.key+')'"
                             is-complete-form-generic-field
                             debounce="500"
                             @input="onAutoFieldSubmit(model,cell.key)"
                         >
                           <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                             <slot :name="slot" v-bind="props" />
                           </template>
                         </bk-inner-input>
                       </slot>
                     </slot>
                   </td>
                 </slot>
               <slot name="afterRow" v-bind="{model, index}"/>
             </Draggable>
             <slot name="afterAllRows" v-bind="{datatable,items}"/>
           </Container>
         </template>
        <template v-else>
          <tbody role="rowgroup">
            <template v-for="(model,index) in items">
              <tr :class="trClass" role="row" :key="model._id" @click="$emit('row-clicked',model)">
                <slot name="row()" v-bind="{model,index,fields: labeledFields}">
                  <td v-for="cell in labeledFields" :key="cell.key" role="cell" :class="'align-middle ' + tdClass">
                    <bk-button-icon
                        v-if="cell.key==='buttonActions'"
                        v-for="action in actions.filter(x=>!['add','back','export','import','custom'].includes(x))"
                        :for="action"
                        :model="model"
                        :fields="modalFields"
                        :exclude="modalExclude"
                        v-bind="$attrs"
                        @tag="$emit('tag',$event)"
                        @remove="onRemove"
                    >
                      <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                        <slot :name="slot" v-bind="props" />
                      </template>
                    </bk-button-icon>
                    <slot
                        v-if="cell.key==='buttonActions'"
                        name="customActions"
                        v-bind="{model, index, field: cell.key, cardMode}"
                    />
                    <slot
                        v-if="cell.key!=='buttonActions'"
                        :name="'cell('+cell.key+')'"
                        v-bind="{model, index, field: cell.key}">
                      <slot name="cell()" v-bind="{model,index,field: cell.key}">
                        <bk-view-inner v-if="!datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" no-label :model="model" :field="cell.key"/>
                        <bk-inner-input
                            v-else-if="datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'"
                            :model="model"
                            :field="cell.key"
                            :form-generic-field="'cell('+cell.key+')'"
                            is-complete-form-generic-field
                            debounce="500"
                            @input="onAutoFieldSubmit(model,cell.key)"
                        >
                          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                            <slot :name="slot" v-bind="props" />
                          </template>
                        </bk-inner-input>
                      </slot>
                    </slot>
                  </td>
                </slot>
              </tr>
              <slot name="afterRow" v-bind="{model, index}"/>
            </template>
            <slot name="afterAllRows" v-bind="{datatable,items}"/>
          </tbody>
        </template>
      </table>
    </slot>
    <div v-if="datatable.handler">
      <div v-if="datatable.firstReady">
        <slot name="pagination-bottom" v-bind="{datatable, scroll, perPage}">
          <bk-pagination
              v-if="!full && !noPagination"
              :datatable="datatable"
              :scroll="scroll"
              :perPage="datatable.perPage"
              :updateRoute="updateRoute"
              :count="count"
              @page-click="$emit('page-click',$event)"
          >
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-pagination>
        </slot>
      </div>
      <div v-else>
        <slot name="loading-bottom">
          <bk-loading type="dots"/>
        </slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
  import { Tracker } from "meteor/tracker"
  import { Class, ValidationError } from "meteor/jagi:astronomy";
  import _omit from "lodash/omit";
  import { Container, Draggable } from "@akyma/vue-smooth-dnd";
  import I18n from "../../../../lib/classes/i18n";
  import Datatable from "../../../../lib/classes/datatable";
  import BkButtonIcon from "../links/BkButtonIcon";
  import BkModal from "../modals/BkModal";
  import BkForm from "../forms/BkForm";
  import BkViewInner from "../views/BkViewInner";
  import BkPagination from "./BkPagination";
  import BkLoading from "../loading/BkLoading";
  import {EJSON} from "meteor/ejson";
  import errorPopupMixin from "../../../utils/errorPopupMixin";
  import BkExportToXlsxButton from "../links/BkExportToXlsxButton.vue";

  export default {
    name: "BkTable",
    components: {BkExportToXlsxButton, BkPagination, BkButtonIcon,BkModal,BkForm,BkViewInner,Container,Draggable },
    mixins: [errorPopupMixin],
    props: {
      fields: [Array,String],
      exclude: {
        type: [Array,String]
      },
      exportFields: String,
      editableFields: [String,Array],
      filterClass: Class,
      filterFields: Array,
      noFilterLabel: {
        type: Boolean,
        default: false
      },
      filterButton: {
        type: Boolean,
        default: false
      },
      subscribeFields: [String,Array],
      modalFields: [String,Array],
      modalExclude: [String,Array],
      sort: {
        type: Object,
      },
      sortBy: String,
      sortDesc: Boolean,
      sortValue: Object,
      perPage: Number,
      noPagination: {
        type: Boolean,
        default: false
      },
      page: Number,
      filter: Object, // default filter used, cannot be changer afterwards
      initialFilter: Object, // initial applied filter, can be changed at any time using table filters
      autoFilterSubmit: Boolean, // Auto submit filter fields changes
      // Hide Reset button in filters
      noFilterReset: {
        type: Boolean,
        default: false
      },
      // Params transmitted to subscription's 3rd argument
      subscriptionParams: {
        type: Object,
        default() { return {} }
      },
      autoSubmit: Boolean, // Auto submit editable fields changes
      scroll: Boolean,
      multi: Boolean,
      full: Boolean,
      array: Array,
      model: [String,Class],
      draggable: Boolean,
      card: Boolean,
      cardWithLabel: Boolean,
      minTableWidth: [Number,String],
      actions: {
        type: Array,
        default: function() {return []}
      },
      customActions: Array,
      selector: {
        type: Object,
        default: function() { return {} }
      },
      subscription: String,
      updateRoute: Boolean,
      importFileType: String,
      tdClass: String,
      trClass: String,
      tblClass: String
    },
    data() {
      return {
        sortBySync: this.sortBy,
        sortDescSync: this.sortDesc,
        datatable: new Datatable(this),
        tableModel: Class.getModel(this.model),
        width: window.innerWidth,
        mainKey: 0,
        items: []
      }
    },
    created() {
      window.addEventListener("resize", this.onResize);
      Tracker.autorun(() => {
        this.datatable.readydep.depend()
        if (!this.datatable.handler || this.datatable.handler.ready()) {
          this.items = this.datatable.getArray()
          this.datatable.ready = true
        }
      })
    },
    computed: {
      getFileType() {
        return this.$props.importFileType
      },
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
      },
      cardMode() {
        return this.card || this.width < this.minTableWidth
      },
    },
    meteor: {
      // items() {
      //   //let selection = this.model.find(this.selector).fetch();
      //   //return selection;
      //   return this.datatable.getArray();
      // },
      count() {
        return this.datatable.getCount()
      }
    },
    watch: {
      routeQuery(newValue, oldValue) {
        if (this.updateRoute)
          this.datatable.restoreFilterFromRoute()
      },
    },
    methods: {
      onResize(e) {
        this.width = window.innerWidth;
      },
      onDrop(dropResult){
        if (dropResult.removedIndex === dropResult.addedIndex) return

        let model = this.tableClass
        let keyDragField = model.getFieldsClassByAttribute('dragKey',true)
        if (keyDragField.length === 1){
          let item
          let field = keyDragField[0].name

          //just a switch
          if (Math.abs(dropResult.removedIndex - dropResult.addedIndex) === 1){
            item = this.items[dropResult.removedIndex]
            item.set(field,dropResult.addedIndex + 1)
            item.save()
            item = this.items[dropResult.addedIndex]
            item.set(field,dropResult.removedIndex + 1)
            item.save()
          }else{
            //move down (from 0.. to n)
            if (dropResult.removedIndex < dropResult.addedIndex){
              for (let i = dropResult.removedIndex; i <= dropResult.addedIndex; i++) {
                item = this.items[i]
                if (i === dropResult.removedIndex){
                  item.set(field,dropResult.addedIndex+1)
                  item.save()
                }else{
                  let activeField = item.get(field)
                  item.set(field,activeField-1)
                  item.save()
                }
              }
            }
            //move up (from n to ..0)
            if (dropResult.removedIndex > dropResult.addedIndex){
              for (let i = dropResult.removedIndex; i >= dropResult.addedIndex; i--) {
                item = this.items[i]
                if (i === dropResult.removedIndex){
                  item.set(field,dropResult.addedIndex+1)
                  item.save()
                }else{
                  let activeField = item.get(field)
                  item.set(field,activeField+1)
                  item.save()
                }
              }
            }
          }
        }
      },
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
      },
      onSubmitFormFilter(e) {
        e.preventDefault()
        this.datatable.applyFilter()
      },
      onAutoFilterSubmit(e,field) {
        this.$emit("inputFilter",{field, value: e})
        if (this.autoFilterSubmit)
          this.datatable.applyFilter()
      },
      onAutoFieldSubmit(model,field) {
        this.$emit("change", { model, field, value: model.get(field) })
        if (this.autoSubmit) {
          const old = model.constructor.findOne(model._id)

          if (model.get(field) !== old.get(field))
            model.save({fields: [field]},
                (err, result) => {
                  this.errorCallback(err, result)
                  if (!err)
                    this.$emit("changed", { model, field, value: model.get(field) })
                }
            )
        }
      },
      onResetFormFilter(e) {
        e.preventDefault()
        this.filterFields.forEach(field => this.datatable.filterModel.set(field))
        this.datatable.setFilter(this.initialFilter)
      }
    },

    destroyed() {
      window.removeEventListener("resize", this.onResize);
      this.datatable.stopSubscription();
    }
  }
</script>

<style scoped>
  .card-ghost {
    color: white;
  }
  .card-ghost-drop {
    transition: transform 0.18s ease-in-out;
    transform: rotateZ(0deg);
  }
  .card {
    box-shadow: 0 2px 4px rgb(0 0 0/20%);
  }
  .max100vw {
      max-width: calc(100vw - 1rem);
  }
</style>