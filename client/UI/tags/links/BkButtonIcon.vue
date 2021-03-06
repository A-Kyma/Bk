<template>
  <span v-if="$props.for==='lifecycle'">
    <b-link
        v-for="transition in transitions"
        @click="onClick(transition,$event)"
        :alt="transition.alt">
      <slot>
        <b-icon
            class="BkButton"
            :font-scale="fontScale"
            :icon="transition.icon"
            :variant="transition.variant"
        />
        <t v-if="transition.label">{{transition.label}}</t>
      </slot>
    </b-link>
  </span>
  <b-link
      v-else
      @click="onClick(null,$event)"
      :alt="label">
    <slot>
      <span v-if="computedIcon">
        <b-icon class="BkButton" :font-scale="fontScale" :icon="computedIcon" :variant="computedVariant"/>
        <t v-if="label" :key="label">{{label}}</t>
      </span>
      <b-button v-else variant="outline-secondary">
        <t :key="label">{{label}}</t>
      </b-button>
      <bk-modal :id="modalAddId" v-if="$props['for'] === 'add' && getTypeField" @ok="onSubmitModal">
        <bk-form :model="modalModel" :fields="getTypeField" :modal="modalAddId"/>
      </bk-modal>
      <bk-modal :id="modalFormId" v-if="model && !getRoute" @ok="onSubmitModalForm" :title="'app.' + $props['for']">
        <bk-form ref="modalForm" :model="modalModel" exclude="_id" :modal="modalFormId"/>
      </bk-modal>
    </slot>
  </b-link>
</template>

<script>
import { Class } from "meteor/jagi:astronomy";
import {Role,I18n} from "meteor/a-kyma:bk"

export default {
  name: "BkButtonIcon",
  props: {
    icon: String,
    fontScale: {
      type: String,
      default: "1"
    },
    variant: String,
    for: String,
    model: {Class,String},
    label: String,
    route: String,
  },
  data() {
    return {
      inputModel: {},
      modalModel: undefined,
    }
  },
  created() {
    if (this.model) {this.inputModel = Class.getModel(this.model)}
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
        case "add": return "outline-secondary"
        default: return this.variant;
      }
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
    tableClass() {
      return this.inputModel?.constructor
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
  methods: {
    showError(err) {
      this.model.setError(err);
      this.$root.$bvToast.toast(I18n.t("app.error"),{
        title: I18n.t("app.toast.title.failed"),
        variant: "danger",
        autoHideDelay: 5000
      })
    },
    showSuccess(key="app.toast.title.success") {
      // Toast launched from $root to avoid its destruction while leaving this page
      this.$root.$bvToast.toast(I18n.t("app.success"),{
        title: I18n.t(key),
        variant: "success",
        autoHideDelay: 5000
      })
      this.dismissCountDown = this.dismissSecs;
    },
    onClick(transition,e) {
      if (transition !== null) {
        this.model[transition.field] = transition.to
        this.model.save({fields:[transition.field]},(err,result) => {
          if (err) {
            this.showError(err)
          } else {
            this.showSuccess()
          }
        });
        return
      }
      if (this.$props.for === "delete") {
        this.inputModel?.remove((err,result) => {
          if (err) {
            this.showError(err)
          } else {
            this.showSuccess()
          }
        })
      }
      if (this.$props.for === "add") {
        this.onAdd()
        this.$emit("click",e)
        return
      }
      if (this.$props.for || this.route) {

        if (this.getRoute) {
          //the route exists, go there
          this.$router.push({ name: this.getRoute, params: { id: this.inputModel._id, for: this.$props.for }})
        } else {
          this.modalModel = new (this.tableClass)()
          this.$bvModal.show(this.modalFormId)
        }
      }
      this.$emit("click",e);
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
          this.modalModel = new (this.tableClass)()
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
    onSubmitModalForm(e) {
      this.$refs.modalForm.onSubmit(e)
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>