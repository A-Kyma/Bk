<template>
  <span v-if="$props.for==='lifecycle'">
    <b-link
        v-for="transition in transitions"
        @click="onClick(transition,$event)"
        :alt="transition.alt">
      <slot>
        <b-icon
            :class="'BkButton ' + iconClass"
            :font-scale="fontScale"
            :icon="transition.icon"
            :variant="transition.variant"
        />
        <t v-if="transition.label">{{transition.label}}</t>
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
      <span v-if="computedIcon" :class="textNoWrap">
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
              <b-input-group :prepend="getI18n('app.import.column.separator')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 70px" v-model="separator" id="inline-form-input-separator" :placeholder="getI18n('app.import.column.default.placeholder')"></b-form-input>
              </b-input-group>
              <b-input-group :prepend="getI18n('app.import.list.separator')" class="mb-2 mr-sm-2">
                <b-form-input style="width: 70px" v-model="listSeparator" id="inline-form-input-listseparator" :placeholder="getI18n('app.import.list.default.placeholder')"></b-form-input>
              </b-input-group>
              <h6><t>app.import.filecolumns.title</t></h6>
              <b-input-group v-for="item in getImportModelFields()" :prepend="item.label" class="mb-2 mr-sm-2">
                <b-form-input style="width: 120px" v-model="csvColumns[item.name]" :id="'inline-form-input-'+item.name" type="number" :placeholder="item.placeholder"></b-form-input>
              </b-input-group>
            </b-form>
          </div>
          <b-form id="form-csv-upload" >
            <b-form-file
                ref="file-input"
                accept=".csv"
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
            </div>
            <div v-if="item.statusCode === 'error'" style="color: darkred">
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
                v-if="model && !getRoute"
                @ok="onSubmitModalForm"
                @shown="$emit('shown')"
                @hide="$emit('hide')"
                :size="size"
                :title="'app.' + $props['for']">
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
import {Role,I18n} from "meteor/a-kyma:bk"
import errorPopupMixin from "../../../utils/errorPopupMixin";

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
    params: {
      type: Object,
      default() { {} },
    }
  },
  data() {
    return {
      inputModel: undefined,
      modalModel: undefined,
      separator: null,
      listSeparator: null,
      importFile: null,
      header: 'not_accepted',
      result: [],
      error: null,
      csvColumns: {},
      visible: true
    }
  },
  created() {
    if (this.model) {this.inputModel = Class.getModel(this.model,this.params)}
  },
  computed: {
    computedIcon() {
      switch (this.$props.for) {
        case "view": return "zoom-in";
        case "new": return "plus-circle";
        case "update": return "pencil";
        case "delete": return "trash2-fill";
        default: return this.icon;
      }
    },
    computedVariant() {
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
      let role = Role.check(this.model)

      lifecycleFields.forEach(field => {
        result=result.concat(field.type.class.getTransitionsForModel(this.model, field.name))
      })
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
    modalModelClass() {
      return this.model.getFieldClass(this.field);
    },
    getTypeField() {
      return this.tableClass?.definition.typeField;
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
  },
  methods: {
    getI18n(key){
      return I18n.get(key)
    },
    onChange(payload) {
      this.$emit("change",payload)
    },
    onClick(transition,e) {
      if (transition !== null) {
        this.model[transition.field] = transition.to
        this.model.save({fields:[transition.field]},this.errorCallback);
        return
      }
      if (this.$props.for === "delete") {
        // remove doesn't exist if model is not linked to a database

        let conf = true
        if (!this.noConfirm) conf = confirm(I18n.get("app.removeConfirmation"))
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
          this.$router.push({ name: this.getRoute, params})
        } else {
          this.modalModel = this.tableClass.findOne(this.model._id) //new (this.tableClass)(this.model.raw())
          this.$bvModal.show(this.modalFormId)
        }
      }
      this.$emit("click",e,this.model);
    },
    onAdd() {
      //add a new model of same type afterwards
      let typefield = this.getTypeField;
      if (typefield) {
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
            }
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
    getImportModelFields(){
      let modelClass = Class.getModel(this.model)
      return modelClass.constructor.getImportFieldsClass()
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

      let csvColumns = Object.entries(component.csvColumns).map((e) => ( { 'field':e[0],'column': parseInt(e[1]) } ))
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
      let separator = (component.separator === null) ? ";" : component.separator
      let listSeparator = (component.listSeparator === null) ? "," : component.listSeparator
      if (separator === listSeparator){
        component.result = []
        component.error = I18n.get("app.import.error.identicalseparator")
        return
      }

      this.visible = false

      this.readFile(component,function(content) {

        let fileArray = content.split(/\r\n|\n/)
        if (header === 'accepted') fileArray.splice(0,1);

        let param = {}
        param.separator = separator
        param.listSeparator = listSeparator
        param.csvColumns = csvColumns

        component.result = []

        fileArray.forEach(function (line){
          if (line === "") return
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
    },
    readFile(component,onLoadCallback) {
      let csvFile = component.importFile
      let reader = new FileReader();
      reader.onload = function (){
        let content=this.result
        onLoadCallback(content);
      }
      reader.readAsText(csvFile);
    }
  },

}
</script>

<style scoped>
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