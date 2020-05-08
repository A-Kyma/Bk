<template>
    <b-form :inline="inline" @submit="onSubmit" @reset="onReset">
        <b-alert
                :show="showAlert"
                variant="danger"
                fade
                dismissible
                @dismissed="showAlert=false">
            <t>app.failed</t>
        </b-alert>
        <b-alert
                :show="dismissCountDown"
                variant="success"
                fade
                dismissible
                @dismiss-count-down="countDownChanged"
                @dismissed="dismissCountDown=0">
            <t>app.success</t>
        </b-alert>
        <slot v-bind="{...$props, ...$attrs}" :model="formModel.get()">
            <bk-field-list v-bind="{...$props, ...$attrs}" :model="formModel.get()"
            />
        </slot>
        <bk-submit :for="submitFor" @cancel="onCancel"/>
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
        formModel: new ReactiveVar(Class.getModel(this.model)),
        astroModel: null,
        showAlert: false,
        dismissSecs: 5,
        dismissCountDown: 0
      }
    },
    computed: {
        submitFor() {
          let model = this.formModel.get();
          return model.isPersisted() ? "update" : "new";
        }
    },
    /*
    created() {
      this.formModel = new ReactiveVar(Class.getModel(this.model));
    },
     */
    // provides formModel to all descendant, if necessary, and avoiding to add formModel as a property of each children
    provide() {
      return {
        formModel: this.formModel
      }
    },
    methods: {
      countDownChanged(count) {
        this.dismissCountDown = count;
      },
      showSuccess() {
        this.dismissCountDown = this.dismissSecs;
      },
      onSubmit(e) {
        e.preventDefault()
        let self = this;
        let model = this.formModel.get();
        model.save({stopOnFirstError:false},function(err,id) {
            if (err) {
              model.setError(err);
              self.showAlert = true;
            } else {
              self.showSuccess()
            }
        })
        this.formModel.set(model);
      },
      onReset(e) {
        e.preventDefault()
        let model = this.formModel.get();
        let newModel;
        if (model.isPersisted()) {
          newModel = model.constructor.findOne(model._id);
        } else {
          newModel = new (model.constructor)();
        }
        this.showAlert = false;
        this.formModel.set(newModel);
      },
      onCancel(e) {
        // Needs to go back
        console.log("cancel");
      }
    },
    meteor: {
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