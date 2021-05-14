<template>
  <b-link @click="onClick" :alt="label">
    <slot>
      <b-icon class="BkButton" :font-scale="fontScale" :icon="computedIcon" :variant="computedVariant"/>
      <t v-if="label">{{label}}</t>
    </slot>
  </b-link>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkButtonIcon",
  props: {
    icon: String,
    fontScale: {
      type: Number,
      default: 1
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
    }
  },
  methods: {
    onClick(e) {
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