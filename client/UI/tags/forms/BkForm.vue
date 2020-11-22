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
        <slot v-bind="$attrs" :model="formModel">
          <bk-field-list v-bind="$attrs" :for="$props['for']">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-field-list>
        </slot>
        <slot name="submit" v-bind="$attrs" :model="formModel">
          <bk-submit v-if="!modal" :for="submitFor" :toast="toast" @cancel="onCancel">
            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>
          </bk-submit>
        </slot>
      </b-overlay>
    </b-form>
</template>

<script>
import {Class} from "meteor/jagi:astronomy";
import BkFieldList from "./BkFieldList";
import BkSubmit from "./BkSubmit";
import I18n from "../../../../lib/classes/i18n";

export default {
    name: "BkForm",
    components: {BkFieldList,BkSubmit},
    props: {
      model: [String,Class],
      inline: Boolean,
      modal: Boolean,
      toast: Boolean,
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
        inline: this.inline,
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
        let self = this;

        this.$emit("submit",e);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;
        e.preventDefault()

        self.showOverlay=true;
        let model = this.formModel;
        //model.isValid();
        model.save({stopOnFirstError:false},function(err,id) {
          self.showOverlay=false;
            if (err) {
              let f=new Event("submitFailed");
              self.$emit("submitFailed",f,self,model,err)
              if (f.defaultPrevented) return

              model.setError(err);
              self.showAlert = true;
              // Scroll to alert after DOM was updated
              self.$nextTick(() => {
                self.$refs.form.scrollIntoView({behavior: "smooth"});
              })
            } else {
              let s=new Event("submitSuccess");
              self.$emit("submitSuccess",s,self,model)
              if (s.defaultPrevented) return

              self.showAlert = false;
              self.showSuccess()
              if (self.modal) {

              } else if (self.toast) {
                self.$bvToast.hide()
              } else {
                self.$router.go(-1);
              }
            }
        })
        this.formModel.set(model);
      },
      onReset(e) {
        this.$emit("reset",e);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;
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
        this.$emit("cancel",e);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;

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