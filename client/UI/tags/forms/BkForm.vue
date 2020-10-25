<template>
    <b-form v-bind="$attrs" :inline="inline" @submit="onSubmit" @reset="onReset">
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
        <slot v-bind="$attrs" :model="formModel">
            <bk-field-list v-bind="$attrs"/>
        </slot>
        <bk-submit :for="submitFor" @cancel="onCancel"/>
    </b-form>
</template>

<script>
import {Class} from "meteor/jagi:astronomy";
import BkFieldList from "./BkFieldList";
import I18n from "../../../../lib/classes/i18n";

export default {
    name: "BkForm",
    components: {BkFieldList},
    props: {
      model: [String,Class],
      inline: Boolean,
    },
    data() {
      return {
        formModel: Class.getModel(this.model),
        showAlert: false,
        dismissSecs: 5,
        dismissCountDown: 0,
      }
    },
    computed: {
        submitFor() {
          let model = this.formModel;
          return model.isPersisted() ? "update" : "new";
        },
    },
    // provides formModel to all descendant, if necessary, and avoiding to add formModel as a property of each children
    provide() {
      return {
        formModel: this.formModel,
        showAlert: this.showAlert,
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
        let model = this.formModel;
        //model.isValid();
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
        let model = this.formModel;
        let newModel;
        if (model.isPersisted()) {
          newModel = model.constructor.findOne(model._id);
        } else {
          newModel = new (model.constructor)();
        }
        this.showAlert = false;
        this.formModel.clearError();
        this.formModel.set(newModel.raw());
      },
      onCancel(e) {
        // Needs to go back
        console.log("cancel");
      }
    },
    meteor: {
      originalModel() {
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