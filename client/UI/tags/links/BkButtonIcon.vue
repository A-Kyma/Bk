<template>
  <b-link @click="onClick">
    <b-icon class="BkButton" :icon="computedIcon" :variant="computedVariant"/>
  </b-link>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkButtonIcon",
  props: {
    icon: String,
    variant: String,
    for: String,
    model: {Class,String},
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
        case "edit": return "pencil";
        case "delete": return "trash2-fill";
        default: return this.icon;
      }
    },
    computedVariant() {
      switch (this.$props.for) {
        case "view": return "primary"
        case "new": return "success";
        case "edit": return "success";
        case "delete": return "danger";
        default: return this.variant;
      }
    }
  },
  methods: {
    onClick(e) {
      if (this.$props.for) {
        let routeName = this.model.constructor.getHighestParent().getName();
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