
import { Class } from "meteor/akyma:astronomy";
import {Role,I18n,DateTime} from "meteor/akyma:bk"
import errorPopupMixin from "../../../utils/errorPopupMixin";
import * as XLSX from 'xlsx/xlsx.mjs';

const _sfc_main = {
  name: "BkButtonIcon",
  mixins: [errorPopupMixin],
  props: {
    icon: String,
    fontScale: {
      type: String,
      default: Meteor.settings.public.UI?.buttonFontScale || "1"
    },
    scale: {
      type: String,
      default: Meteor.settings.public.UI?.buttonScale || "1"
    },
    noTransform:{
      type: Boolean,
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
    buttonIcon: {
      type: Boolean
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
    closeModal() {
      if (this.$props['for'] === 'add') {
        this.$bvModal.hide(this.modalAddId)
      } else {
        this.$bvModal.hide(this.modalFormId)
      }
    },
    showOverlay() {
      if (this.$props['for'] === 'add') {
        this.$refs.modalAddForm.showOverlay()
      } else {
        this.$refs.modalForm.showOverlay()
      }
    },
    hideOverlay() {
      if (this.$props['for'] === 'add') {
        this.$refs.modalAddForm.hideOverlay()
      } else {
        this.$refs.modalForm.hideOverlay()
      }
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
            this.inputModel?.remove((err,result)=>this.errorCallback(err,result,this.inputModel))
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
        this.$emit("export")
        //this.$parent.datatable.exportToCsv()
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
      e.preventDefault()
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
      console.log(component.importFile)

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
            param.dateTimeFormat = (component.dateTimeFormat === null) ? "YYYY/MM/DD HH:mm" : component.dateTimeFormat.replace(/AA/g,'YY', ).replace('JJ','DD')
            param.dateFormat = ""
            param.timeFormat = ""
          }else{
            param.dateTimeFormat = ""
            param.dateFormat = (component.dateFormat === null) ? "YYYY/MM/DD" : component.dateFormat.replace(/AA/g,'YY').replace('JJ','DD')
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
            param.dateTimeFormat = (component.dateTimeFormat === null) ? "YYYY/MM/DD HH:mm" : component.dateTimeFormat.replace(/AA/g,'YY').replace('JJ','DD')
            param.dateFormat = ""
            param.timeFormat = ""
          }else{
            param.dateTimeFormat = ""
            param.dateFormat = (component.dateFormat === null) ? "YYYY/MM/DD" : component.dateFormat.replace(/AA/g,'YY').replace('JJ','DD')
            param.timeFormat = (component.timeFormat === null) ? "HH:mm" : component.timeFormat
          }
          param.csvColumns = csvColumns
          param.timeZone = DateTime.getTimeZone()
          if (component.$router.currentRoute.params){
            param.routeParams = component.$router.currentRoute.params
          }

          component.result = []

          fileArray.forEach(function (line){
            console.log(line)
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
          component.importFile = null
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


export default _sfc_main;

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, renderSlot as _renderSlot, resolveComponent as _resolveComponent, createVNode as _createVNode, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, withCtx as _withCtx, createBlock as _createBlock, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, mergeProps as _mergeProps, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, createSlots as _createSlots } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { style: {"color":"darkred","margin-bottom":"0px"} }
const _hoisted_3 = { style: {"width":"100%"} }
const _hoisted_4 = { key: 0 }
const _hoisted_5 = {
  key: 0,
  style: {"color":"darkred"}
}
const _hoisted_6 = { key: 1 }

function render(_ctx, _cache) {
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_t = _resolveComponent("t")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_link = _resolveComponent("b-link")
  const _component_b_form_input = _resolveComponent("b-form-input")
  const _component_b_input_group = _resolveComponent("b-input-group")
  const _component_b_form_checkbox = _resolveComponent("b-form-checkbox")
  const _component_b_th = _resolveComponent("b-th")
  const _component_b_tr = _resolveComponent("b-tr")
  const _component_b_td = _resolveComponent("b-td")
  const _component_b_table_simple = _resolveComponent("b-table-simple")
  const _component_b_alert = _resolveComponent("b-alert")
  const _component_b_collapse = _resolveComponent("b-collapse")
  const _component_b_form = _resolveComponent("b-form")
  const _component_b_form_file = _resolveComponent("b-form-file")
  const _component_b_badge = _resolveComponent("b-badge")
  const _component_b_container = _resolveComponent("b-container")
  const _component_bk_modal = _resolveComponent("bk-modal")
  const _component_bk_form = _resolveComponent("bk-form")

  return (_ctx.$props.for==='lifecycle')
    ? (_openBlock(), _createElementBlock("span", _hoisted_1, [
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.transitions, (transition) => {
          return (_openBlock(), _createBlock(_component_b_link, {
            onClick: $event => (_ctx.onClick(transition,$event)),
            class: _normalizeClass((transition.label) ? 'btn':''),
            alt: transition.alt
          }, {
            default: _withCtx(() => [
              _renderSlot(_ctx.$slots, "default", {}, () => [
                (_ctx.button)
                  ? (_openBlock(), _createBlock(_component_b_button, {
                      key: 0,
                      class: _normalizeClass(transition.class),
                      variant: transition.variant
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_b_icon, {
                          icon: transition.icon,
                          animation: transition.animation,
                          "aria-hidden": "true"
                        }, null, 8 /* PROPS */, ["icon", "animation"]),
                        (transition.label)
                          ? (_openBlock(), _createBlock(_component_t, {
                              key: transition.label
                            }, {
                              default: _withCtx(() => [
                                _createTextVNode(_toDisplayString(transition.label), 1 /* TEXT */)
                              ]),
                              _: 2 /* DYNAMIC */
                            }, 1024 /* DYNAMIC_SLOTS */))
                          : _createCommentVNode("v-if", true)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["class", "variant"]))
                  : (_openBlock(), _createBlock(_component_b_icon, {
                      key: 1,
                      class: _normalizeClass('BkButton ' + _ctx.iconClass),
                      "font-scale": _ctx.fontScale,
                      icon: transition.icon,
                      variant: transition.variant
                    }, null, 8 /* PROPS */, ["class", "font-scale", "icon", "variant"])),
                (!_ctx.button && transition.label)
                  ? (_openBlock(), _createBlock(_component_t, {
                      key: transition.label
                    }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(transition.label), 1 /* TEXT */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1024 /* DYNAMIC_SLOTS */))
                  : _createCommentVNode("v-if", true)
              ])
            ]),
            _: 2 /* DYNAMIC */
          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick", "class", "alt"]))
        }), 256 /* UNKEYED_FRAGMENT */))
      ]))
    : (_ctx.computedPermission)
      ? (_openBlock(), _createBlock(_component_b_link, {
          key: 1,
          onClick: _cache[16] || (_cache[16] = $event => (_ctx.onClick(null,$event))),
          alt: _ctx.label,
          title: _ctx.title
        }, {
          default: _withCtx(() => [
            _renderSlot(_ctx.$slots, "default", {}, () => [
              (_ctx.computedIcon && !_ctx.button && !_ctx.buttonIcon)
                ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    class: _normalizeClass(_ctx.textNoWrap)
                  }, [
                    (_ctx.noTransform)
                      ? (_openBlock(), _createBlock(_component_b_icon, {
                          key: 0,
                          class: _normalizeClass('mr-1' + _ctx.iconClass),
                          scale: _ctx.scale,
                          "font-scale": _ctx.fontScale,
                          icon: _ctx.computedIcon,
                          variant: _ctx.computedVariant
                        }, null, 8 /* PROPS */, ["class", "scale", "font-scale", "icon", "variant"]))
                      : (_openBlock(), _createBlock(_component_b_icon, {
                          key: 1,
                          class: _normalizeClass('BkButton ' + _ctx.iconClass),
                          scale: _ctx.scale,
                          "font-scale": _ctx.fontScale,
                          icon: _ctx.computedIcon,
                          variant: _ctx.computedVariant
                        }, null, 8 /* PROPS */, ["class", "scale", "font-scale", "icon", "variant"])),
                    (_ctx.label)
                      ? (_openBlock(), _createBlock(_component_t, { key: _ctx.label }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_ctx.label), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }))
                      : _createCommentVNode("v-if", true)
                  ], 2 /* CLASS */))
                : (_ctx.computedIcon && _ctx.buttonIcon)
                  ? (_openBlock(), _createBlock(_component_b_button, {
                      key: 1,
                      class: _normalizeClass(_ctx.iconClass)
                    }, {
                      default: _withCtx(() => [
                        (_ctx.noTransform)
                          ? (_openBlock(), _createBlock(_component_b_icon, {
                              key: 0,
                              class: _normalizeClass('mr-1' + _ctx.iconClass),
                              scale: _ctx.scale,
                              "font-scale": _ctx.fontScale,
                              icon: _ctx.computedIcon,
                              variant: _ctx.computedVariant
                            }, null, 8 /* PROPS */, ["class", "scale", "font-scale", "icon", "variant"]))
                          : (_openBlock(), _createBlock(_component_b_icon, {
                              key: 1,
                              class: _normalizeClass('BkButton ' + _ctx.iconClass),
                              scale: _ctx.scale,
                              "font-scale": _ctx.fontScale,
                              icon: _ctx.computedIcon,
                              variant: _ctx.computedVariant
                            }, null, 8 /* PROPS */, ["class", "scale", "font-scale", "icon", "variant"])),
                        (_openBlock(), _createBlock(_component_t, { key: _ctx.label }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_ctx.label), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }))
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["class"]))
                  : (_openBlock(), _createBlock(_component_b_button, {
                      key: 2,
                      class: _normalizeClass(_ctx.iconClass),
                      variant: _ctx.computedVariant
                    }, {
                      default: _withCtx(() => [
                        (_openBlock(), _createBlock(_component_t, { key: _ctx.label }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_ctx.label), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }))
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["class", "variant"])),
              (_ctx.$props['for'] === 'import')
                ? (_openBlock(), _createBlock(_component_bk_modal, _mergeProps({
                    key: 3,
                    id: _ctx.modalImportId,
                    model: _ctx.model,
                    "ok-only": "",
                    size: "lg"
                  }, _ctx.$attrs), {
                    title: _withCtx(() => [
                      _createVNode(_component_t, null, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.model) + ".import.title", 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    default: _withCtx(() => [
                      _createVNode(_component_b_button, {
                        class: _normalizeClass(_ctx.visible ? null : 'collapsed'),
                        "aria-expanded": _ctx.visible ? 'true' : 'false',
                        "aria-controls": "collapse-1",
                        onClick: _cache[0] || (_cache[0] = $event => (_ctx.visible = !_ctx.visible)),
                        variant: "primary",
                        size: "sm"
                      }, {
                        default: _withCtx(() => [
                          _createVNode(_component_t, null, {
                            default: _withCtx(() => [...(_cache[17] || (_cache[17] = [
                              _createTextVNode("app.import.toogleform", -1 /* CACHED */)
                            ]))]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["class", "aria-expanded"]),
                      _cache[41] || (_cache[41] = _createElementVNode("div", { class: "h-divider" }, null, -1 /* CACHED */)),
                      _createVNode(_component_b_collapse, {
                        visible: "",
                        id: "collapse-1",
                        modelValue: _ctx.visible,
                        "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((_ctx.visible) = $event))
                      }, {
                        default: _withCtx(() => [
                          _createElementVNode("div", null, [
                            _createElementVNode("h6", null, [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [...(_cache[18] || (_cache[18] = [
                                  _createTextVNode("app.import.fileformat.title", -1 /* CACHED */)
                                ]))]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _createVNode(_component_b_form, {
                              id: "form-csv-link",
                              inline: ""
                            }, {
                              default: _withCtx(() => [
                                (_ctx.getImportFileType !== 'xls')
                                  ? (_openBlock(), _createBlock(_component_b_input_group, {
                                      key: 0,
                                      prepend: _ctx.getI18n('app.import.column.separator'),
                                      class: "mb-2 mr-sm-2"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_b_form_input, {
                                          style: {"width":"70px"},
                                          modelValue: _ctx.separator,
                                          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.separator) = $event)),
                                          id: "inline-form-input-separator",
                                          placeholder: _ctx.getI18n('app.import.column.default.placeholder')
                                        }, null, 8 /* PROPS */, ["modelValue", "placeholder"])
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["prepend"]))
                                  : _createCommentVNode("v-if", true),
                                _createVNode(_component_b_input_group, {
                                  prepend: _ctx.getI18n('app.import.list.separator'),
                                  class: "mb-2 mr-sm-2"
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_b_form_input, {
                                      style: {"width":"70px"},
                                      modelValue: _ctx.listSeparator,
                                      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.listSeparator) = $event)),
                                      id: "inline-form-input-listseparator",
                                      placeholder: _ctx.getI18n('app.import.list.default.placeholder'),
                                      readonly: _ctx.getImportFileType === 'xls'
                                    }, null, 8 /* PROPS */, ["modelValue", "placeholder", "readonly"])
                                  ]),
                                  _: 1 /* STABLE */
                                }, 8 /* PROPS */, ["prepend"]),
                                _createVNode(_component_b_input_group, { class: "col-12 mb-2" }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_b_form_checkbox, {
                                      id: "inline-form-checkbox-oneDateTimeFormat",
                                      modelValue: _ctx.oneDateTime,
                                      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.oneDateTime) = $event)),
                                      name: "checkbox-1",
                                      value: "accepted",
                                      "unchecked-value": "not_accepted"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_t, null, {
                                          default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
                                            _createTextVNode("app.import.onedatetime.format", -1 /* CACHED */)
                                          ]))]),
                                          _: 1 /* STABLE */
                                        })
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["modelValue"])
                                  ]),
                                  _: 1 /* STABLE */
                                }),
                                (_ctx.oneDateTime === 'accepted')
                                  ? (_openBlock(), _createBlock(_component_b_input_group, {
                                      key: 1,
                                      prepend: _ctx.getI18n('app.import.datetime.format'),
                                      class: "mb-2 mr-sm-2"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_b_form_input, {
                                          style: {"width":"200px"},
                                          modelValue: _ctx.dateTimeFormat,
                                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.dateTimeFormat) = $event)),
                                          id: "inline-form-input-dateTimeFormat",
                                          placeholder: _ctx.getI18n('app.import.datetime.default.placeholder')
                                        }, null, 8 /* PROPS */, ["modelValue", "placeholder"])
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["prepend"]))
                                  : _createCommentVNode("v-if", true),
                                (_ctx.oneDateTime !== 'accepted')
                                  ? (_openBlock(), _createBlock(_component_b_input_group, {
                                      key: 2,
                                      class: "mb-2 mr-sm-2 w-100"
                                    }, {
                                      default: _withCtx(() => [
                                        _createElementVNode("p", _hoisted_2, [
                                          _createVNode(_component_t, null, {
                                            default: _withCtx(() => [...(_cache[20] || (_cache[20] = [
                                              _createTextVNode("app.import.dateformat.info", -1 /* CACHED */)
                                            ]))]),
                                            _: 1 /* STABLE */
                                          })
                                        ])
                                      ]),
                                      _: 1 /* STABLE */
                                    }))
                                  : _createCommentVNode("v-if", true),
                                (_ctx.oneDateTime !== 'accepted')
                                  ? (_openBlock(), _createBlock(_component_b_input_group, {
                                      key: 3,
                                      prepend: _ctx.getI18n('app.import.date.format'),
                                      class: "mb-2 mr-sm-2"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_b_form_input, {
                                          style: {"width":"150px"},
                                          modelValue: _ctx.dateFormat,
                                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((_ctx.dateFormat) = $event)),
                                          id: "inline-form-input-dateFormat",
                                          placeholder: _ctx.getI18n('app.import.date.default.placeholder')
                                        }, null, 8 /* PROPS */, ["modelValue", "placeholder"])
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["prepend"]))
                                  : _createCommentVNode("v-if", true),
                                (_ctx.oneDateTime !== 'accepted')
                                  ? (_openBlock(), _createBlock(_component_b_input_group, {
                                      key: 4,
                                      prepend: _ctx.getI18n('app.import.time.format'),
                                      class: "mb-2 mr-sm-2"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_b_form_input, {
                                          style: {"width":"150px"},
                                          modelValue: _ctx.timeFormat,
                                          "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((_ctx.timeFormat) = $event)),
                                          id: "inline-form-input-timeFormat",
                                          placeholder: _ctx.getI18n('app.import.time.default.placeholder')
                                        }, null, 8 /* PROPS */, ["modelValue", "placeholder"])
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["prepend"]))
                                  : _createCommentVNode("v-if", true),
                                _createVNode(_component_b_button, {
                                  class: _normalizeClass(_ctx.visibleDateFormat ? 'mb-2' : 'collapsed mb-2'),
                                  "aria-expanded": _ctx.visibleDateFormat ? 'true' : 'false',
                                  "aria-controls": "collapse-2",
                                  onClick: _cache[7] || (_cache[7] = $event => (_ctx.visibleDateFormat = !_ctx.visibleDateFormat)),
                                  variant: "primary",
                                  size: "sm"
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_t, null, {
                                      default: _withCtx(() => [...(_cache[21] || (_cache[21] = [
                                        _createTextVNode("app.import.dateformat.show", -1 /* CACHED */)
                                      ]))]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _: 1 /* STABLE */
                                }, 8 /* PROPS */, ["class", "aria-expanded"]),
                                _createVNode(_component_b_collapse, {
                                  visible: "",
                                  id: "collapse-2",
                                  modelValue: _ctx.visibleDateFormat,
                                  "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((_ctx.visibleDateFormat) = $event))
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_b_alert, {
                                      show: "",
                                      class: "w-100"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_b_table_simple, {
                                          small: "",
                                          class: "mb-0"
                                        }, {
                                          default: _withCtx(() => [
                                            _createVNode(_component_b_tr, null, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[22] || (_cache[22] = [
                                                        _createTextVNode("app.import.dateformat.year", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[23] || (_cache[23] = [
                                                        _createTextVNode("app.import.dateformat.month", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[24] || (_cache[24] = [
                                                        _createTextVNode("app.import.dateformat.day", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                                                        _createTextVNode("app.import.dateformat.hour", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[26] || (_cache[26] = [
                                                        _createTextVNode("app.import.dateformat.minute", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_th, { class: "bc" }, {
                                                  default: _withCtx(() => [
                                                    _createVNode(_component_t, null, {
                                                      default: _withCtx(() => [...(_cache[27] || (_cache[27] = [
                                                        _createTextVNode("app.import.dateformat.other", -1 /* CACHED */)
                                                      ]))]),
                                                      _: 1 /* STABLE */
                                                    })
                                                  ]),
                                                  _: 1 /* STABLE */
                                                })
                                              ]),
                                              _: 1 /* STABLE */
                                            }),
                                            _createVNode(_component_b_tr, null, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[28] || (_cache[28] = [
                                                    _createTextVNode("YYYY", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[29] || (_cache[29] = [
                                                    _createTextVNode("MM", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[30] || (_cache[30] = [
                                                    _createTextVNode("DD", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[31] || (_cache[31] = [
                                                    _createTextVNode("HH", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[32] || (_cache[32] = [
                                                    _createTextVNode("mm", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                }),
                                                _createVNode(_component_b_td, { class: "bc" }, {
                                                  default: _withCtx(() => [...(_cache[33] || (_cache[33] = [
                                                    _createTextVNode("x", -1 /* CACHED */)
                                                  ]))]),
                                                  _: 1 /* STABLE */
                                                })
                                              ]),
                                              _: 1 /* STABLE */
                                            })
                                          ]),
                                          _: 1 /* STABLE */
                                        }),
                                        _createVNode(_component_t, null, {
                                          default: _withCtx(() => [...(_cache[34] || (_cache[34] = [
                                            _createTextVNode("app.import.dateformat.example", -1 /* CACHED */)
                                          ]))]),
                                          _: 1 /* STABLE */
                                        }),
                                        _cache[35] || (_cache[35] = _createTextVNode(": SA 30/04/2022 10:30 -> xxxDD/MM/YYYYxHH:mm ", -1 /* CACHED */))
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _: 1 /* STABLE */
                                }, 8 /* PROPS */, ["modelValue"]),
                                _createVNode(_component_b_input_group, { class: "col-12 mb-2" }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_b_form_checkbox, {
                                      id: "inline-form-checkbox-testOnly",
                                      modelValue: _ctx.testOnly,
                                      "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((_ctx.testOnly) = $event)),
                                      name: "checkbox-1",
                                      value: "accepted",
                                      "unchecked-value": "not_accepted"
                                    }, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_t, null, {
                                          default: _withCtx(() => [...(_cache[36] || (_cache[36] = [
                                            _createTextVNode("app.import.testOnly", -1 /* CACHED */)
                                          ]))]),
                                          _: 1 /* STABLE */
                                        })
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["modelValue"])
                                  ]),
                                  _: 1 /* STABLE */
                                }),
                                _createElementVNode("h6", _hoisted_3, [
                                  _createVNode(_component_t, null, {
                                    default: _withCtx(() => [...(_cache[37] || (_cache[37] = [
                                      _createTextVNode("app.import.filecolumns.title", -1 /* CACHED */)
                                    ]))]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.getImportModelFields, (item) => {
                                  return (_openBlock(), _createBlock(_component_b_input_group, {
                                    prepend: item.label,
                                    class: "mb-2 mr-sm-2"
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_b_form_input, {
                                        style: {"width":"120px"},
                                        modelValue: _ctx.csvColumns[item.name],
                                        "onUpdate:modelValue": $event => ((_ctx.csvColumns[item.name]) = $event),
                                        id: 'inline-form-input-'+item.name,
                                        type: "number",
                                        placeholder: item.placeholder
                                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "id", "placeholder"])
                                    ]),
                                    _: 2 /* DYNAMIC */
                                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["prepend"]))
                                }), 256 /* UNKEYED_FRAGMENT */))
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _createVNode(_component_b_form, { id: "form-csv-upload" }, {
                            default: _withCtx(() => [
                              _createVNode(_component_b_form_file, {
                                ref: "file-input",
                                accept: _ctx.getExtension,
                                "browse-text": _ctx.getI18n('app.import.file.browse'),
                                modelValue: _ctx.importFile,
                                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((_ctx.importFile) = $event)),
                                placeholder: _ctx.getI18n('app.import.file.placeholder'),
                                "drop-placeholder": _ctx.getI18n('app.import.file.drop')
                              }, null, 8 /* PROPS */, ["accept", "browse-text", "modelValue", "placeholder", "drop-placeholder"]),
                              _createVNode(_component_b_form_checkbox, {
                                id: "headerPresent",
                                modelValue: _ctx.header,
                                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((_ctx.header) = $event)),
                                name: "headerPresent",
                                value: "accepted",
                                "unchecked-value": "not_accepted"
                              }, {
                                default: _withCtx(() => [
                                  _createVNode(_component_t, null, {
                                    default: _withCtx(() => [...(_cache[38] || (_cache[38] = [
                                      _createTextVNode("app.import.file.switchheader", -1 /* CACHED */)
                                    ]))]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }, 8 /* PROPS */, ["modelValue"])
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _cache[39] || (_cache[39] = _createElementVNode("div", { class: "h-divider" }, null, -1 /* CACHED */))
                        ]),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["modelValue"]),
                      _createVNode(_component_b_container, {
                        class: "pt-3",
                        id: "result-import"
                      }, {
                        default: _withCtx(() => [
                          (_ctx.error !== null)
                            ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
                                _createVNode(_component_b_alert, {
                                  show: "",
                                  variant: "danger"
                                }, {
                                  default: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(_ctx.error), 1 /* TEXT */)
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]))
                            : _createCommentVNode("v-if", true),
                          (_ctx.result.length > 0)
                            ? (_openBlock(true), _createElementBlock(_Fragment, { key: 1 }, _renderList(_ctx.result, (item) => {
                                return (_openBlock(), _createBlock(_component_b_alert, {
                                  show: "",
                                  variant: "light"
                                }, {
                                  default: _withCtx(() => [
                                    _createElementVNode("div", null, [
                                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(item.fields, (field) => {
                                        return (_openBlock(), _createElementBlock("span", null, _toDisplayString(field), 1 /* TEXT */))
                                      }), 256 /* UNKEYED_FRAGMENT */)),
                                      (item.statusCode === 'success')
                                        ? (_openBlock(), _createBlock(_component_b_badge, {
                                            key: 0,
                                            class: "float-right badge-lg",
                                            variant: "success"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(item.statusLabel), 1 /* TEXT */)
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */))
                                        : _createCommentVNode("v-if", true),
                                      (item.statusCode === 'error')
                                        ? (_openBlock(), _createBlock(_component_b_badge, {
                                            key: 1,
                                            class: "float-right badge-lg",
                                            variant: "danger"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(item.statusLabel), 1 /* TEXT */)
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */))
                                        : _createCommentVNode("v-if", true),
                                      (item.statusCode === 'warning')
                                        ? (_openBlock(), _createBlock(_component_b_badge, {
                                            key: 2,
                                            class: "float-right badge-lg",
                                            variant: "warning"
                                          }, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(item.statusLabel), 1 /* TEXT */)
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    (item.statusCode === 'error')
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_5, _toDisplayString(item.reason), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true),
                                    (item.statusCode === 'warning')
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_6, _toDisplayString(item.reason), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true)
                                  ]),
                                  _: 2 /* DYNAMIC */
                                }, 1024 /* DYNAMIC_SLOTS */))
                              }), 256 /* UNKEYED_FRAGMENT */))
                            : _createCommentVNode("v-if", true)
                        ]),
                        _: 1 /* STABLE */
                      }),
                      (_ctx.importFile !== null)
                        ? (_openBlock(), _createBlock(_component_b_button, {
                            key: 0,
                            class: "mt-2",
                            variant: "success",
                            onClick: _ctx.onSubmitImportModal
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_t, null, {
                                default: _withCtx(() => [...(_cache[40] || (_cache[40] = [
                                  _createTextVNode("app.import.btn.label", -1 /* CACHED */)
                                ]))]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }, 8 /* PROPS */, ["onClick"]))
                        : _createCommentVNode("v-if", true)
                    ]),
                    _: 1 /* STABLE */
                  }, 16 /* FULL_PROPS */, ["id", "model"]))
                : _createCommentVNode("v-if", true),
              (_ctx.$props['for'] === 'add' && _ctx.getTypeField)
                ? (_openBlock(), _createBlock(_component_bk_modal, {
                    key: 4,
                    id: _ctx.modalAddId,
                    onOk: _ctx.onSubmitModal
                  }, {
                    default: _withCtx(() => [
                      _createVNode(_component_bk_form, _mergeProps({
                        ref: "modalAddForm",
                        model: _ctx.modalModel,
                        fields: _ctx.getTypeField,
                        modal: _ctx.modalAddId,
                        for: "add"
                      }, _ctx.$attrs, { onChange: _ctx.onChange }), null, 16 /* FULL_PROPS */, ["model", "fields", "modal", "onChange"])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["id", "onOk"]))
                : _createCommentVNode("v-if", true),
              (_ctx.model && !_ctx.getRoute && _ctx.$props['for'] !== 'delete')
                ? (_openBlock(), _createBlock(_component_bk_modal, {
                    key: 5,
                    id: _ctx.modalFormId,
                    onOk: _ctx.onSubmitModalForm,
                    onShown: _cache[14] || (_cache[14] = $event => (_ctx.$emit('shown'))),
                    onHide: _cache[15] || (_cache[15] = $event => (_ctx.$emit('hide'))),
                    size: _ctx.size,
                    title: _ctx.title || 'app.' + _ctx.$props['for']
                  }, _createSlots({
                    default: _withCtx(() => [
                      _createVNode(_component_bk_form, _mergeProps({
                        ref: "modalForm",
                        model: _ctx.modalModel,
                        "form-field": "modal",
                        fields: _ctx.fields,
                        exclude: _ctx.computedExclude,
                        modal: _ctx.modalFormId,
                        for: _ctx.$props['for']
                      }, _ctx.$attrs, {
                        onChange: _ctx.onChange,
                        onTag: _cache[13] || (_cache[13] = $event => (_ctx.$emit('tag',$event)))
                      }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                        _renderList(_ctx.$scopedSlots, (_, slot) => {
                          return {
                            name: slot,
                            fn: _withCtx((props) => [
                              _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps({...props,model: _ctx.modalModel})))
                            ])
                          }
                        })
                      ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "fields", "exclude", "modal", "for", "onChange"])
                    ]),
                    _: 2 /* DYNAMIC */
                  }, [
                    _renderList(_ctx.$scopedSlots, (_, slot) => {
                      return {
                        name: slot,
                        fn: _withCtx((props) => [
                          _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps({...props,model: _ctx.modalModel})))
                        ])
                      }
                    })
                  ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["id", "onOk", "size", "title"]))
                : _createCommentVNode("v-if", true)
            ])
          ]),
          _: 3 /* FORWARDED */
        }, 8 /* PROPS */, ["alt", "title"]))
      : _createCommentVNode("v-if", true)
}
_sfc_main.render = render;
