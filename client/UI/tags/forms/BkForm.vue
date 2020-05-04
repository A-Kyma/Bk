<template>
    <b-form :inline="inline">
        <slot v-bind="{...$props, ...$attrs}" :model="formModel.get()">
            <bk-field-list v-bind="{...$props, ...$attrs}" :model="formModel.get()"
            />
        </slot>
        <bk-submit :formModel="formModel" :model="formModel.get()" :for="$props['for']"/>
    </b-form>
</template>

<script>
  import { Class } from "meteor/jagi:astronomy";
  import BkFieldList from "./BkFieldList";
  import I18n from "../../../../lib/classes/i18n";
  import { ReactiveVar} from "meteor/reactive-var";

  let rv = new ReactiveVar()

  export default {
    name: "BkForm",
    components: {BkFieldList},
    props: {
      model: [String,Class],
      for: String,
      fields: [String,Array],
      exclude: [String,Array],
      noEdit: [String,Array],
      inline: Boolean,
    },
    data() {
      return {
        formModel: null,
        astroModel: null
      }
    },
    computed: {

    },
    created() {
      this.formModel = new ReactiveVar(Class.getModel(this.model));
    },
    methods: {
      onSubmit(e) {
        e.preventDefault()
        let model=this.getModel;
        model.save({stopOnFirstError:false})
      },
      onReset(e) {
        e.preventDefault()
        console.log("reset");
        console.log(this);
        console.log(e);
        let model=this.getModel;
        let newModel;
        if (model.isPersisted()) {
          newModel = model.constructor.findOne(model._id);
        } else {
          newModel = new (model.constructor)();
        }
        this.model=newModel;
      },
      onCancel(e) {
        // Needs to go back
      }
    },
    meteor: {
      topModel() {

      },
      getModel() {
        return Class.getModel(this.model);
      },
      submit() {
        return I18n.t("app." + this.$props.for)
      },
      reset() {
        return I18n.t("app.reset");
      },
      cancel() {
        return I18n.t("app.cancel");
      }
    }
  }
</script>

<style scoped>

</style>