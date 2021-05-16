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
      <b-icon class="BkButton" :font-scale="fontScale" :icon="computedIcon" :variant="computedVariant"/>
      <t v-if="label">{{label}}</t>
    </slot>
  </b-link>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
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
    }
  },
  methods: {
    showError(err) {
      this.model.setError(err);
      this.$root.$bvToast.toast(I18n.t("app.file.error"),{
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
      if (this.$props.for || this.route) {
        let routeName;
        if (this.route)
          routeName = this.route
        else
          routeName = this.model.constructor.getHighestParent().getName();
        let route = this.$router.resolve({name: routeName});
        if (route.resolved.matched.length > 0) {
          //the route exists, go there
          this.$router.push({ name: routeName, params: { id: this.inputModel._id, for: this.$props.for }})
        }
      }
      this.$emit("click",e);
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>