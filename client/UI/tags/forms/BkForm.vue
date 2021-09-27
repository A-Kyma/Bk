<template>
    <b-form ref="form"
        v-bind="$attrs"
        :inline="inline"
        @submit="onSubmit"
        @reset="onReset">
      <b-overlay :show="isOverlay">
        <template #overlay>
          <slot name="overlay"/>
        </template>
        <b-alert
                :show="showAlert"
                variant="danger"
                fade
                dismissible
                @dismissed="showAlert=false">
            <t>app.failed</t>
          <!-- Show global error thrown by Meteor.Error -->
          <br><span v-if="!!globalError"><t>{{globalError}}</t></span>
        </b-alert>

        <slot v-bind="{...$props,...$attrs}" :model="formModel">
          <bk-field-list v-bind="$attrs" :for="$props['for']" @change="onChangeInput">

            <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
              <slot :name="slot" v-bind="props" />
            </template>

          </bk-field-list>
        </slot>
        <slot name="formButtons" v-bind="{...$props,...$attrs}" :model="formModel">
          <bk-submit v-if="!modal" v-bind="$attrs" :for="submitFor" :toast="toast" @cancel="onCancel">
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
import {I18n} from "meteor/a-kyma:bk"
import BkFieldList from "./BkFieldList";
import BkSubmit from "./BkSubmit";

export default {
    name: "BkForm",
    components: {BkFieldList,BkSubmit},
    props: {
      model: [String,Class],
      inline: Boolean,
      modal: String,
      toast: Boolean,
      for: String,
      simulation: {
        type: Boolean,
        default: true
      },
      meteorMethod: String,
    },
    data() {
      return {
        formModel: Class.getModel(this.model),
        showAlert: false,
        dismissSecs: 5,
        dismissCountDown: 0,
        isOverlay: false,
      }
    },
    computed: {
      submitFor() {
        let model = this.formModel;
        if (this.$props['for'] === 'view' || this.$props['for'] === "delete") {
          return "view";
        }
        if (!this.$props['for'])
          return model.isPersisted() ? "update" : "new";
        return this.$props['for']
      },
    },
    meteor: {
      globalError() {
          return this.formModel.getError('MeteorError');
      }
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
      onChangeInput(payload) {
        this.$emit("change",payload)
      },
      showOverlay() {
        this.isOverlay=true;
      },
      hideOverlay() {
        this.isOverlay=false;
      },
      countDownChanged(count) {
        this.dismissCountDown = count;
      },
      hideFail(){
        this.showAlert=false;
      },
      showFail() {
        this.showAlert=true;
      },
      showSuccess(key="app.toast.title.success") {
        // Toast launched from $root to avoid its destruction while leaving this page
        this.$root.$bvToast.toast(I18n.t("app.success"),{
          title: I18n.t(key),
          variant: "success",
          autoHideDelay: 5000
        })
        this.dismissCountDown = this.dismissSecs;
      },
      onSubmit(e) {
        let self = this;
        if (this["for"] === "view") {
          if (self.modal) {
            self.$bvModal.hide(self.modal)
          } else if (self.toast) {
            self.$bvToast.hide()
          } else {
            self.$router.go(-1);
          }
          return
        }

        let model = this.formModel;

        this.$emit("submit",e,self,model);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;
        e.preventDefault()

        self.showOverlay();
        //model.isValid();

        // Save only fields that is declared as to be shown in the form
        let fields = self.model.constructor.getFieldsNamesByFilter({
          fields: self.$attrs.fields,
          exclude: self.$attrs.exclude
        })

        let callback = function(err,id) {
          self.hideOverlay();
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
                self.$bvModal.hide(self.modal)
              } else if (self.toast) {
                self.$bvToast.hide()
              } else {
                self.$router.go(-1);
              }
            }
        }
        if (this.meteorMethod) {
          model.callMethod(this.meteorMethod,callback)
        } else {
          model.save({fields, stopOnFirstError:false, simulation: this.simulation},callback)
        }

        this.formModel.set(model);
      },
      onReset(e) {
        this.$emit("reset",e,this,this.model);
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
        this.$emit("cancel",e,this,this.model);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;

        // Needs to go back
        if (this.modal) {
          this.$bvModal.hide(self.modal)
        } else {
          this.$router.go(-1);
        }
        console.log("cancel");
      }
    },
  }
</script>

<style scoped>

</style>