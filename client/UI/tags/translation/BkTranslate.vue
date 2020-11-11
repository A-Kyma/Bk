<template>
    <span>{{translation}}</span>
</template>

<script>
  import {Class} from "meteor/jagi:astronomy"
  import {Bk} from "../../../../lib/lib.js"
  import I18n from "../../../../lib/classes/i18n";

  export default {
    name: "t",
    props: {
      model: [Class,String],
      field: String
    },
    meteor: {
      translation() {
        if (this.model && this.field) {
          let model = Class.getModel(this.model);
          return I18n.t(model.constructor.getLabelKey(this.field));
        }
        return I18n.t(this.$slots.default[0].text);
      }
    },
  }
</script>

<style scoped>

</style>