<template>
    <label>{{label}}</label>
</template>

<script>
  import I18n from "../../../../lib/classes/i18n";
  import { Class } from "meteor/jagi:astronomy";

  export default {
    name: "BkLabel",
    props: {
      model: Class,
      field: String,
    },
    computed: {
      label() {
        return I18n.t(this.model.constructor.getLabelKey(this.field))
      },
    },
  }
</script>

<style scoped>

</style>