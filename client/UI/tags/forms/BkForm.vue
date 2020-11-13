<template>
    <b-form ref="form"
        v-bind="$attrs"
        :inline="inline"
        @submit="onSubmit"
        @reset="onReset">
      <b-overlay :show="showOverlay">
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
          <bk-field-list v-bind="$attrs" :for="$props['for']">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-field-list>
        </slot>
        <bk-submit v-if="!modal" :for="submitFor" @cancel="onCancel"/>
      </b-overlay>
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
      modal: Boolean,
      for: String,
    },
    data() {
      return {
        formModel: Class.getModel(this.model),
        showAlert: false,
        dismissSecs: 5,
        dismissCountDown: 0,
        showOverlay: false,
      }
    },
    computed: {
        submitFor() {
          let model = this.formModel;
          if (this.$props['for'] === 'view' || this.$props['for'] === "delete") {
            return "view";
          }
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
        // Toast launched from $root to avoid its destruction while leaving this page
        this.$root.$bvToast.toast(I18n.t("app.success"),{
          title: I18n.t("app.toast.title.success"),
          variant: "success",
          autoHideDelay: 5000
        })
        this.dismissCountDown = this.dismissSecs;
      },
      onSubmit(e) {
        e.preventDefault()
        let self = this;
        self.showOverlay=true;
        let model = this.formModel;
        //model.isValid();
        model.save({stopOnFirstError:false},function(err,id) {
          self.showOverlay=false;
            if (err) {
              model.setError(err);
              self.showAlert = true;
              // Scroll to alert after DOM was updated
              self.$nextTick(() => {
                self.$refs.form.scrollIntoView({behavior: "smooth"});
              })
            } else {
              self.showAlert = false;
              self.showSuccess()
              if (this.modal) {

              } else {
                self.$router.go(-1);
              }
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
        if (this.modal) {
          //TODO: close the modal
        } else {
          this.$router.go(-1);
        }
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