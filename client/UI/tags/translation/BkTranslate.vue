<template>
  <span @click.meta.exact.capture="showKey">{{translation}}</span>
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
    computed: {
      key() {
        if (this.model && this.field) {
          if (typeof(this.model) === "string"){
            return Class.get(this.model).getLabelKey(this.field);
          }else{
            return this.model.constructor.getLabelKey(this.field);
          }
        }
        return this.$slots.default[0].text;
      }
    },
    meteor: {
      translation() {
        return I18n.t(this.key);
      }
    },
    methods: {
      showKey(e) {
        e.preventDefault()
        let options = {
          title: "Translation",
          autoHideDelay: 5000,
        }
        const h = this.$createElement;
        const vNodeMsg = h(
            'ul',
            [
                h('li',"Locale: " + I18n.getLanguage()),
                h('li',"Key: " + this.key)
            ]
        )
        this.$bvToast.toast([vNodeMsg], { title: "Translation"})
      }
    },
  }
</script>

<style scoped>

</style>