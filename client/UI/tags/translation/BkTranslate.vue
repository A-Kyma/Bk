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
            if (typeof(this.model) === "string"){
                return I18n.t(Class.get(this.model).getLabelKey(this.field));
            }else{
                return I18n.t(this.model.constructor.getLabelKey(this.field));
            }
        }
        return I18n.t(this.$slots.default[0].text);
      }
    },
  }
</script>

<style scoped>

</style>