<template>
  <span v-if="$props.for==='lifecycle'">
    <b-link
        v-for="transition in transitions"
        @click="onClick(transition,$event)"
        :class="(transition.label) ? 'btn':''"
        :alt="transition.alt">
      <slot>
        <b-button
          v-if="button"
          :class="transition.class"
          :variant="transition.variant"
        >
          <b-icon :icon="transition.icon" :animation="transition.animation" aria-hidden="true"/>
          <t v-if="transition.label" :key="transition.label">{{transition.label}}</t>
        </b-button>

        <b-icon
            v-else
            :class="'BkButton ' + iconClass"
            :font-scale="fontScale"
            :icon="transition.icon"
            :variant="transition.variant"
        />
        <t v-if="!button && transition.label" :key="transition.label">{{transition.label}}</t>
      </slot>
    </b-link>
  </span>
  <b-link
      v-else-if="computedPermission"
      @click="onClick(null,$event)"
      :alt="label"
      :title="title"
  >
    <slot>
      <span v-if="computedIcon && !button" :class="textNoWrap">
        <b-icon :class="'BkButton ' + iconClass" :font-scale="fontScale" :icon="computedIcon" :variant="computedVariant"/>
        <t v-if="label" :key="label">{{label}}</t>
      </span>
      <b-button v-else :class="iconClass" :variant="computedVariant">
        <t :key="label">{{label}}</t>
      </b-button>
      <bk-modal :id="modalImportId"
                v-if="$props['for'] === 'import'"
                :model="model"
                ok-only
                size="lg"
                v-bind="$attrs"
      >
        <template v-slot:title>
          <t>{{model}}.import.title</t>
        </template>
        <b-button
            :class="visible ? null : 'collapsed'"
            :aria-expanded="visible ? 'true' : 'false'"
            aria-controls="collapse-1"
            @click="visible = !visible"
            variant="primary"
            size="sm">
          <t>app.import.toogleform</t>
        </b-button>
        <div class="h-divider"/>
        <b-collapse visible id="collapse-1" v-model="visible" >
          <div>
            <h6><t>app.import.fileformat.title</t></h6>
            <b-form id="form-csv-link" inline>
              <b-input-group v-if="getImportFileType !== 'xls'" :prepend="getI18n('app.import.column.separator')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 70px" v-model="separator" id="inline-form-input-separator" :placeholder="getI18n('app.import.column.default.placeholder')"></b-form-input>
              </b-input-group>
              <b-input-group :prepend="getI18n('app.import.list.separator')" class="mb-2 mr-sm-2">
                <b-form-input
                  style="width: 70px"
                  v-model="listSeparator"
                  id="inline-form-input-listseparator"
                  :placeholder="getI18n('app.import.list.default.placeholder')"
                  :readonly="getImportFileType === 'xls'"
                />
              </b-input-group>
              <b-input-group class="col-12 mb-2">
                <b-form-checkbox id="inline-form-checkbox-oneDateTimeFormat" v-model="oneDateTime" name="checkbox-1" value="accepted" unchecked-value="not_accepted">
                  <t>app.import.onedatetime.format</t>
                </b-form-checkbox>
              </b-input-group>
              <b-input-group v-if="oneDateTime === 'accepted'" :prepend="getI18n('app.import.datetime.format')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 200px" v-model="dateTimeFormat" id="inline-form-input-dateTimeFormat" :placeholder="getI18n('app.import.datetime.default.placeholder')"></b-form-input>
              </b-input-group>
              <b-input-group v-if="oneDateTime !== 'accepted'" class="mb-2 mr-sm-2 w-100">
              <p style="color: darkred; margin-bottom: 0px"> <t>app.import.dateformat.info</t></p>
              </b-input-group>
              <b-input-group v-if="oneDateTime !== 'accepted'" :prepend="getI18n('app.import.date.format')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 150px" v-model="dateFormat" id="inline-form-input-dateFormat" :placeholder="getI18n('app.import.date.default.placeholder')"></b-form-input>
              </b-input-group>
              <b-input-group v-if="oneDateTime !== 'accepted'" :prepend="getI18n('app.import.time.format')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 150px" v-model="timeFormat" id="inline-form-input-timeFormat" :placeholder="getI18n('app.import.time.default.placeholder')"></b-form-input>
              </b-input-group>
              <b-button
                  :class="visibleDateFormat ? 'mb-2' : 'collapsed mb-2'"
                  :aria-expanded="visibleDateFormat ? 'true' : 'false'"
                  aria-controls="collapse-2"
                  @click="visibleDateFormat = !visibleDateFormat"
                  variant="primary"
                  size="sm">
                <t>app.import.dateformat.show</t>
              </b-button>
              <b-collapse visible id="collapse-2" v-model="visibleDateFormat" >
                <b-alert show class="w-100">
                  <b-table-simple small class="mb-0">
                    <b-tr>
                      <b-th class="bc"><t>app.import.dateformat.year</t></b-th>
                      <b-th class="bc"><t>app.import.dateformat.month</t></b-th>
                      <b-th class="bc"><t>app.import.dateformat.day</t></b-th>
                      <b-th class="bc"><t>app.import.dateformat.hour</t></b-th>
                      <b-th class="bc"><t>app.import.dateformat.minute</t></b-th>
                      <b-th class="bc"><t>app.import.dateformat.other</t></b-th>
                    </b-tr>
                    <b-tr>
                      <b-td class="bc">YYYY</b-td>
                      <b-td class="bc">MM</b-td>
                      <b-td class="bc">DD</b-td>
                      <b-td class="bc">HH</b-td>
                      <b-td class="bc">mm</b-td>
                      <b-td class="bc">x</b-td>
                    </b-tr>
                  </b-table-simple>
                  <t>app.import.dateformat.example</t>: SA 30/04/2022 10:30 -> xxxDD/MM/YYYYxHH:mm
                </b-alert>
              </b-collapse>
              <b-input-group class="col-12 mb-2">
                <b-form-checkbox id="inline-form-checkbox-testOnly" v-model="testOnly" name="checkbox-1" value="accepted" unchecked-value="not_accepted">
                  <t>app.import.testOnly</t>
                </b-form-checkbox>
              </b-input-group>
              <h6 style="width: 100%"><t>app.import.filecolumns.title</t></h6>
              <b-input-group v-for="item in getImportModelFields" :prepend="item.label" class="mb-2 mr-sm-2">
                <b-form-input style="width: 120px" v-model="csvColumns[item.name]" :id="'inline-form-input-'+item.name" type="number" :placeholder="item.placeholder"></b-form-input>
              </b-input-group>
            </b-form>
          </div>
          <b-form id="form-csv-upload" >
            <b-form-file
                ref="file-input"
                :accept="getExtension"
                :browse-text="getI18n('app.import.file.browse')"
                v-model="importFile"
                :placeholder="getI18n('app.import.file.placeholder')"
                :drop-placeholder="getI18n('app.import.file.drop')"
            />

            <b-form-checkbox
                id="headerPresent"
                v-model="header"
                name="headerPresent"
                value="accepted"
                unchecked-value="not_accepted"
            >
              <t>app.import.file.switchheader</t>
            </b-form-checkbox>
          </b-form>
          <div class="h-divider"/>
        </b-collapse>

        <b-container class=" pt-3" id="result-import">
          <div v-if="error !== null">
            <b-alert show variant="danger">{{ error }}</b-alert>
          </div>
          <b-alert v-if="result.length > 0" v-for="item in result" show variant="light">
            <div>
              <span v-for="field in item.fields">{{ field }} </span>
              <b-badge class= " float-right badge-lg" v-if="item.statusCode === 'success'" variant="success">{{ item.statusLabel }}</b-badge>
              <b-badge class= " float-right badge-lg" v-if="item.statusCode === 'error'" variant="danger">{{ item.statusLabel }}</b-badge>
              <b-badge class= " float-right badge-lg" v-if="item.statusCode === 'warning'" variant="warning">{{ item.statusLabel }}</b-badge>
            </div>
            <div v-if="item.statusCode === 'error'" style="color: darkred">
              {{ item.reason }}
            </div>
            <div v-if="item.statusCode === 'warning'">
              {{ item.reason }}
            </div>
          </b-alert>
        </b-container>
        <b-button
            v-if="importFile !== null"
            class="mt-2"
            variant="success"
            @click="onSubmitImportModal"
        >
          <t>app.import.btn.label</t>
        </b-button>

      </bk-modal>
      <bk-modal :id="modalAddId"
                v-if="$props['for'] === 'add' && getTypeField"
                @ok="onSubmitModal">
        <bk-form
            :model="modalModel"
            :fields="getTypeField"
            :modal="modalAddId"
            for="add"
            v-bind="$attrs"
            @change="onChange"
        />
      </bk-modal>
      <bk-modal :id="modalFormId"
                v-if="model && !getRoute && $props['for'] !== 'delete'"
                @ok="onSubmitModalForm"
                @shown="$emit('shown')"
                @hide="$emit('hide')"
                :size="size"
                :title="title || 'app.' + $props['for']">
        <bk-form
            ref="modalForm"
            :model="modalModel"
            form-field="modal"
            :fields="fields"
            :exclude="computedExclude"
            :modal="modalFormId"
            :for="$props['for']"
            v-bind="$attrs"
            @change="onChange"
            @tag="$emit('tag',$event)"
        >
          <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>
        </bk-form>
      </bk-modal>
    </slot>
  </b-link>
</template>

<script>
import { Class } from "meteor/jagi:astronomy";
import {Role,I18n,DateTime} from "meteor/akyma:bk"
import errorPopupMixin from "../../../utils/errorPopupMixin";
import * as XLSX from 'xlsx/xlsx.mjs';

export default {
  name: "BkButtonIcon",
  mixins: [errorPopupMixin],
  props: {
    icon: String,
    fontScale: {
      type: String,
      default: Meteor.settings.public.UI?.buttonScale || "1"
    },
    size: String, // modal size
    variant: String,
    iconClass: String,
    for: String,
    model: {Class,String},
    fields: [Array,String],
    exclude: [Array,String],
    noConfirm: Boolean,
    label: String,
    title: String,
    route: String,
    nowrap: Boolean,
    importFileType: String,
    params: {
      type: Object,
      default() { {} },
    },
    typeField:{
      type: String,
    },
    button: {
      // Force button mode
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default() { {} }
    },
    transition: {
      type: Object
    }
  },
  data() {
    return {
      inputModel: undefined,
      modalModel: undefined,
      separator: null,
      listSeparator: null,
      dateTimeFormat: null,
      importFile: null,
      header: 'not_accepted',
      result: [],
      error: null,
      csvColumns: {},
      visible: true,
      visibleDateFormat: false,
      oneDateTime: 'not_accepted',
      dateFormat: null,
      timeFormat: null,
      testOnly: 'not_accepted'
    }
  },
  created() {
    if (this.model) {this.inputModel = Class.getModel(this.model,this.params)}
  },
  computed: {
    getExtension(){
      return this.$props.importFileType === "xls" ? ".xls,.xlsx" : ".csv"
    },
    getImportFileType(){
      return this.$props.importFileType
    },
    computedIcon() {
      if (!!this.icon) return this.icon
      switch (this.$props.for) {
        case "view": return "zoom-in";
        case "new": return "plus-circle";
        case "update": return "pencil";
        case "delete": return "trash2-fill";
        default: return this.icon;
      }
    },
    computedVariant() {
      if (!!this.variant) return this.variant
      switch (this.$props.for) {
        case "view": return "primary"
        case "new": return "success";
        case "update": return "success";
        case "delete": return "danger";
        case "add": return "outline-primary";
        case "back": return "outline-dark";
        case "export": return "outline-dark"
        case "import": return "outline-dark"
        default: return this.variant;
      }
    },
    computedExclude() {
      let result = this.exclude
      if (result) {
        if (Array.isArray(result)) {
          result.push('_id')
          return result
        }
        if (typeof result === "string") {
          result += ',_id'
          return result
        }
      }
      return "_id"
    },
    transitions: function () {
      let result = []
      let lifecycleFields = this.model.getFieldsByType("Lifecycle")

      lifecycleFields.forEach(field => {
        result=result.concat(field.type.class.getTransitionsForModel(this.model, field.name))
      })
      if (!!this.transition)
        return result.filter(t => t.name === this.transition.name)
      return result;
    },
    textNoWrap() {
      if (this.nowrap) {
        return "text-nowrap"
      }
    },
    tableClass() {
      return this.inputModel?.constructor
    },
    modalImportId() {
      return 'modalImport_' + this._uid;
    },
    modalAddId() {
      return 'modalAdd_' + this._uid;
    },
    modalFormId() {
      return 'modalForm_' + this._uid;
    },
    getTypeField() {
      return (this.typeField) ? this.typeField : this.tableClass?.definition.typeField
    },
    getRoute() {
      let routeName
      if (this.route)
        routeName = this.route
      else
        routeName = this.tableClass.getHighestParent().getName();
      let route = this.$router.resolve({name: routeName});
      if (route.resolved.matched.length > 0)
        return routeName
    },
  },
  meteor: {
    computedPermission(){
      if (!this.inputModel) return true
      switch (this.$props.for) {
        case "view": return this.inputModel.canView()
        case "new": return this.inputModel.canCreate()
        case "update": return this.inputModel.canUpdate()
        case "delete": return this.inputModel.canDelete()
        case "add": return this.inputModel.canCreate()
        default: return true
      }
    },
    getImportModelFields(){
      if (this.$props['for'] !== 'import') return
      let modelClass = Class.getModel(this.model)
      return modelClass.constructor.getImportFieldsClass({importFileType: this.$props.importFileType})
    },
  },
  methods: {
    getI18n(key){
      return I18n.get(key)
    },
    onChange(payload) {
      this.$emit("change",payload)
    },
    click(event) {
      this.onClick(null,event)
    },
    onClick(transition,e) {
      if (transition !== null) {
        // Allow to use @transition.prevent
        const event = new Event("transition",{cancelable: true})
        let conf
        if (transition.confirm) {
          conf = confirm(I18n.get("app.submitConfirmation", {
            label: I18n.get(transition.label)
          }))
          if (!conf) return
        }
        this.$emit("transition",event,transition)
        if (event.defaultPrevented) return
        return this.model[transition.name](this.errorCallback)
      }
      if (this.$props.for === "delete") {
        // remove doesn't exist if model is not linked to a database

        let conf = true
        if (!this.noConfirm) conf = confirm(I18n.get("app.removeConfirmationLabel",{
          label: typeof this.inputModel?.defaultName === "function" && this.inputModel.defaultName() || ""
        }))
        if (conf){
          if (this.inputModel?.remove)
            this.inputModel?.remove(this.errorCallback)
          else
            this.$emit("remove",this.inputModel)
        }
        return
      }
      if (this.$props.for === "add" || this.$props.for === "new") {
        this.onAdd()
        this.$emit("click",e)
        return
      }
      if (this.$props.for === "back") {
        this.$router.go(-1)
        return
      }
      if (this.$props.for === 'export') {
        this.$parent.datatable.exportToCsv()
        return
      }
      if (this.$props.for === 'import') {
        this.$bvModal.show(this.modalImportId);
        this.$emit("click",e)
        return
      }
      if (this.$props.for || this.route) {

        if (this.getRoute) {
          //the route exists, go there
          //concatenate params passed to bk-button-icon and params of the line
          let localParams = { id: this.inputModel._id, for: this.$props.for }
          let params = {...this.params,...localParams}
          this.$router.push({ name: this.getRoute, params, query: this.query })
        } else {
          this.modalModel = this.tableClass.findOne(this.model._id) || this.model //new (this.tableClass)(this.model.raw())
          this.$bvModal.show(this.modalFormId)
        }
      }
      const event = new Event("click",{cancelable: true})
      this.$emit("click",event,this.model);
    },
    onAdd() {
      //add a new model of same type afterwards
      let typefield = this.getTypeField;
      if (typefield && (!this.params || !this.params[typefield])) {
        // Ask for new model using same type field
        this.modalModel = new (this.tableClass)(this.params);
        this.$bvModal.show(this.modalAddId);
      } else {
        // TODO: Go directly on modification page or show modification modal

        if (this.getRoute) {
          //the route exists, go there
          this.$router.push({
            name: this.getRoute,
            params: {
              for: "new",
              id: this.getRoute,
              ...this.params
            },
            query: this.query
          })
        }
        else {
          this.modalModel = new (this.tableClass)(this.params)
          this.$bvModal.show(this.modalFormId)
          //
          // let routeName = this.route || this.tableClass.getHighestParent().getName()
          // let error = new ValidationError([{
          //   name: routeName,
          //   type: "RouteError",
          //   message: I18n.get("Error.missingRoute",{param: routeName})
          // }])
          // // Toast launched from $root to avoid its destruction while leaving this page
          // this.$root.$bvToast.toast(I18n.get("Error.missingRoute",{param: routeName}),{
          //   title: I18n.t("app.failed"),
          //   variant: "danger",
          //   autoHideDelay: 5000
          // })
        }
      }
    },
    onSubmitModal(e) {
      e.preventDefault();
      let modelClass = Class.get(this.modalModel.type);
      if (!modelClass) {
        this.modalModel.throwError(
            this.getTypeField,
            "TypeError",
            "Error.missingSubType",
            this.modalModel.type
        )
        return;
      }
      if (!this.modalModel.isValid(this.getTypeField)) {
        // if modal form content not valid, do not close it
        return;
      }
      if (this.getRoute) {
        //the route exists, go there
        this.$router.push({
          name: this.getRoute,
          params: {
            for: "new",
            id: this.modalModel[this.getTypeField],
            ...this.params
          }
        })
      }
      else {
        this.modalModel.throwError(
            this.getTypeField,
            "RouteError",
            "Error.missingRoute",
            this.getRoute
        )
      }
    },

    onSubmitModalForm(e) {
      this.$refs.modalForm.onSubmit(e)
    },
    onSubmitImportModal(e){

      let component = this
      component.error = null
      component.result = []

      let csvFile = component.importFile
      if (csvFile === null){
        component.error = I18n.get("app.import.nofile")
        return
      }

      let csvColumns = Object.entries(component.csvColumns).map((e) => ( { 'field':e[0],'column': e[1] } ))
      let csvColumnsKeys = Object.keys(component.csvColumns)

      let modelClass = component.inputModel
      if (modelClass === undefined){
        modelClass = Class.getModel(component.model)
      }

      if (modelClass === undefined) return

      component.result.push(I18n.get("app.import.uploading"))

      let fields = modelClass.constructor.getImportFieldsClass()

      let missingMandatoryField = false
      let index = 1
      fields.forEach(function(item){
        if (item.optional === false) {
          if (!csvColumnsKeys.includes(item.name)){
            missingMandatoryField = true
            if (index === 1){
              component.error = I18n.get("app.import.error.missingcolumn") + item.label.replace('*','')
              index = index + 1
            }else{
              component.error = component.error + ", " + item.label.replace('*','')
              index = index + 1
            }
          }
        }
      })
      if (missingMandatoryField){
        component.result = []
        return
      }
      let header = component.header
      let oneDateTime = component.oneDateTime
      let testOnly = component.testOnly
      let separator
      let listSeparator
      if (component.$props.importFileType === undefined){
        separator = (component.separator === null) ? ";" : component.separator
        listSeparator = (component.listSeparator === null) ? "," : component.listSeparator
        if (separator === listSeparator){
          component.result = []
          component.error = I18n.get("app.import.error.identicalseparator")
          return
        }
      }

      this.visible = false
      if (component.$props.importFileType === undefined){
        this.readFile(component,function(content) {

          let fileArray = content.split(/\r\n|\n/)
          if (header === 'accepted') fileArray.splice(0,1);

          let param = {}
          param.separator = separator
          param.listSeparator = listSeparator
          param.csvColumns = csvColumns
          param.timeZone = DateTime.getTimeZone()
          param.oneDateFormat = oneDateTime
          param.testOnly = testOnly
          if (oneDateTime === 'accepted'){
            param.dateTimeFormat = (component.dateTimeFormat === null) ? "YYYY/MM/DD HH:mm" : component.dateTimeFormat.replace('AAAA','YYYY').replace('JJ','DD')
            param.dateFormat = ""
            param.timeFormat = ""
          }else{
            param.dateTimeFormat = ""
            param.dateFormat = (component.dateFormat === null) ? "YYYY/MM/DD" : component.dateFormat.replace('AAAA','YYYY').replace('JJ','DD')
            param.timeFormat = (component.timeFormat === null) ? "HH:mm" : component.timeFormat
          }
          if (component.$router.currentRoute.params){
            param.routeParams = component.$router.currentRoute.params
          }

          component.result = []

          fileArray.forEach(function (line){
            if (line.length < 11) return
            param.data = line
            modelClass.callMethod('import',param,(err, result) => {
              if (err){
                component.result.push(err)
              } else {
                if (result){
                  component.result.push(result)
                }
              }
            })
          })
        })
      } else{
        this.readFile(component,function(content) {
          let workbook = XLSX.read(content, {
            type: 'binary'
          });
          let Sheet = workbook.SheetNames[0];
          let excelRows = XLSX.utils.sheet_to_csv(workbook.Sheets[Sheet],{FS: ";"});

          let fileArray = excelRows.split(/\r\n|\n/)
          if (header === 'accepted') fileArray.splice(0,1);
          let param = {}
          param.separator = ";"
          param.listSeparator = ","
          param.oneDateFormat = oneDateTime
          param.testOnly = testOnly
          if (oneDateTime === 'accepted'){
            param.dateTimeFormat = (component.dateTimeFormat === null) ? "YYYY/MM/DD HH:mm" : component.dateTimeFormat.replace('AAAA','YYYY').replace('JJ','DD')
            param.dateFormat = ""
            param.timeFormat = ""
          }else{
            param.dateTimeFormat = ""
            param.dateFormat = (component.dateFormat === null) ? "YYYY/MM/DD" : component.dateFormat.replace('AAAA','YYYY').replace('JJ','DD')
            param.timeFormat = (component.timeFormat === null) ? "HH:mm" : component.timeFormat
          }
          param.csvColumns = csvColumns
          param.timeZone = DateTime.getTimeZone()
          if (component.$router.currentRoute.params){
            param.routeParams = component.$router.currentRoute.params
          }

          component.result = []

          fileArray.forEach(function (line){
            if (line.length < 11) return
            param.data = line
            modelClass.callMethod('import',param,(err, result) => {
              if (err){
                component.result.push(err)
              } else {
                if (result){
                  component.result.push(result)
                }
              }
            })
          })
        })
      }
    },
    readFile(component,onLoadCallback) {
      let file = component.importFile
      let reader = new FileReader();
      reader.onload = function (){
        let content=this.result
        onLoadCallback(content);
      }
      if (component.$props.importFileType === undefined) {
        reader.readAsText(file);
      }else{
        reader.readAsBinaryString(file)
      }
    }
  },

}
</script>

<style scoped>
  .bc {
    border-color: black;
  }
  .BkButton:hover{
    transform:scale(1.5);
  }
  .BkButton {
    margin-right: 2px;
  }
  .h-divider{
    margin-top:15px;
    margin-bottom:10px;
    height:1px;
    width:100%;
    border-top:1px solid lightgray;
  }
  .badge-lg{
    font-size: 1em;
  }
  .alert{
    margin-bottom: 0.5rem!important;
    padding: 0.5rem 1.25rem!important;
  }
</style>