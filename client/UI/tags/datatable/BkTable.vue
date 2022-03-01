<template>
  <div class="m-2">
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
      <bk-button-icon v-if="actions.includes('export')"
                      label="app.export"
                      for="export"
                      v-bind="$attrs"
      />
      <bk-button-icon v-if="actions.includes('import')"
                      label="app.import.btn.label"
                      for="import"
                      v-bind="$attrs"
                      :model="model"
      />
    </slot>
    <slot name="customHeader" v-bind="{datatable, model, actions}"/>
    <slot name="filterHeader" v-bind="{datatable,model,actions}">
      <b-form v-if="filterFields"
              @submit="onSubmitFormFilter"
              @reset="onResetFormFilter"
              id="filter-header"
              inline class="mt-2">
        <b-input-group
            v-for="field of filterFields"
            class="mb-2 mr-sm-2 mb-sm-0">
          <template #prepend>
            <b-input-group-text>
              <t>{{datatable.filterModel.constructor.getLabelKey(field)}}</t>
            </b-input-group-text>
          </template>
          <bk-inner-input
              :model="datatable.filterModel"
              :field="field"
              buttons
              button-variant="outline-primary"
              @input="onAutoFilterSubmit"
          />
        </b-input-group>
        <b-button type="reset" variant="outline-dark" class="mr-2"><t>app.reset</t></b-button>
        <b-button v-if="!autoFilterSubmit" type="submit" variant="outline-primary"><t>app.filter</t></b-button>
      </b-form>
    </slot>
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
      <div v-if="card || width < minTableWidth">
        <b-card v-for="(model,index) in items" class="mt-2 mb-2">
          <template #header>
            <span class="mr-2">
              <slot name="cardheader" v-bind="{model,index,fields: labeledFields}">
                {{model.defaultName()}}
              </slot>
            </span>
            <bk-button-icon
                v-for="action in actions.filter(x=>!['add','back','export','import'].includes(x))"
                :for="action"
                :model="model"
                :fields="modalFields"
                :exclude="modalExclude"
                v-bind="$attrs"
                @remove="onRemove"
                class="float-right"
            >
              <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
                <slot :name="slot" v-bind="props" />
              </template>
            </bk-button-icon>
            <slot
                name="customActions"
                v-bind="{model, index}"
            />
          </template>
          <b-card-text role="row" :key="model._id">
            <slot name="cardrow()" v-bind="{model,index,fields: labeledFields}">
              <div v-for="cell in labeledFields" :key="cell.key" role="cell" class="align-middle">
                <slot
                    v-if="cell.key!=='buttonActions'"
                    :name="'cell('+cell.key+')'"
                    v-bind="{model, index, field: cell.key}">
                  <slot name="cell()" v-bind="{model,index,field: cell.key}">
                    <bk-view-inner v-if="!datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" no-label :model="model" :field="cell.key"/>
                    <bk-inner-input v-else-if="datatable.fieldsEditable.includes(cell.key) && cell.key!=='buttonActions'" :model="model" :field="cell.key"/>
                  </slot>
                </slot>
              </div>
            </slot>
          </b-card-text>
          <slot name="afterRow" v-bind="{model, index}"/>
        </b-card>
      </div>
      <table v-else role="table" class="table b-table table-hover mt-3">
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
                      drag-class="card-ghost bg-primary"
                      drop-class="card-ghost-drop"
                      :tag="{value: 'tbody', props: {role: 'rowgroup'}}"
                      lock-axis="y"
                      :get-child-payload="getChildPayload">
             <Draggable v-for="(model,index) in items" :key="model._id" :tag="{value: 'tr', props: {role: 'row'}}">
                 <slot name="row()" v-bind="{model,index,fields: labeledFields}">
                   <td role=cell class="align-middle" style="cursor: pointer"><b-icon icon="arrows-move" aria-hidden="true"></b-icon></td>
                   <td v-for="cell in labeledFields" :key="cell.key" role="cell" class="align-middle">
                     <bk-button-icon
                         v-if="cell.key==='buttonActions'"
                         v-for="action in actions.filter(x=>!['add','back','export','import'].includes(x))"
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
               <slot name="afterRow" v-bind="{model, index}"/>
             </Draggable>
           </Container>
         </template>
        <template v-else>
          <tbody role="rowgroup">
            <template v-for="(model,index) in items">
              <tr role="row" :key="model._id">
                <slot name="row()" v-bind="{model,index,fields: labeledFields}">
                  <td v-for="cell in labeledFields" :key="cell.key" role="cell" class="align-middle">
                    <bk-button-icon
                        v-if="cell.key==='buttonActions'"
                        v-for="action in actions.filter(x=>!['add','back','export','import'].includes(x))"
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
        </template>
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
  import { Container, Draggable } from "vue-smooth-dnd";
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
    components: {BkPagination, BkButtonIcon,BkModal,BkForm,BkViewInner,Container,Draggable },
    props: {
      fields: Array,
      exportFields: String,
      editableFields: [String,Array],
      filterFields: Array,
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
      autoFilterSubmit: Boolean,
      scroll: Boolean,
      multi: Boolean,
      full: Boolean,
      array: Array,
      model: [String,Class],
      draggable: Boolean,
      card: Boolean,
      minTableWidth: [Number,String],
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
      updateRoute: Boolean,
      importFileType: String
    },
    data() {
      return {
        sortBySync: this.sortBy,
        sortDescSync: this.sortDesc,
        datatable: new Datatable(this),
        tableModel: Class.getModel(this.model),
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    created() {
      window.addEventListener("resize", this.onResize);
    },
    distroyed() {
      window.removeEventListener("resize", this.onResize);
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
          this.datatable.restoreFilterFromRoute()
      },
    },
    methods: {
      onResize(e) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
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
      onAutoFilterSubmit(e) {
        if (this.autoFilterSubmit)
          this.datatable.applyFilter()
      },
      onResetFormFilter(e) {
        e.preventDefault()
        this.filterFields.forEach(field => this.datatable.filterModel.set(field))
        this.datatable.applyFilter()
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
</style>