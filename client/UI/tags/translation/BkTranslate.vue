<template>
  <span @click.meta.exact.capture="showKey">{{translation}}</span>
</template>

<script>
  import {Class} from "meteor/akyma:astronomy"
  import {Role} from "meteor/akyma:bk"
  import I18n from "../../../../lib/classes/i18n";
  import BkForm from "../forms/BkForm";

  export default {
    name: "t",
    components: {BkForm},
    props: {
      model: [Class,String],
      field: String,
      options: {
        type: Object,
        default() { return {}}
      },
      locale: String,
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
        return this.$slots.default[0].text.trim();
      },
    },
    meteor: {
      translation() {
        if (this.locale)
          this.options.locale = this.locale
        return I18n.t(this.key,this.options);
      }
    },
    methods: {
      showKey(e) {
        e.preventDefault()
        if (!Role.is("SuperAdministrator")) return
        let options = {
          title: "Translation",
        }
        let [locale,key] = [I18n.getLanguage(),this.key];
        let t=I18n.findOne({locale, key});
        if (!t)
          t=new I18n({locale, key, text: this.translation})
        if (t.text.includes("."))
          t.text = ""
        const h = this.$createElement;
        const vNodeMsg = h(
            'bk-form', {props:{model: t, toast: true}}
        )
        this.$bvToast.toast([vNodeMsg], options);
      }
    },
  }
</script>

<style scoped>

</style>