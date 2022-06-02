<template>
  <b-form ref="form" @submit="onSubmit">
    <b-overlay :show="showOverlay">
      <b-alert
          :show="showAlert"
          variant="danger"
          fade
          dismissible
          @dismissed="showAlert=false">
        <t>app.failed</t>
        <br><span v-if="!!globalError"><t>{{globalError}}</t></span>
      </b-alert>
      <bk-field-list v-bind="{...$props,...$attrs}"
                     :model="formModel.profile"
                     :fields="requiredFields"
                     for="new"
                     variant="secondary"
                     size="sm"
                     label-cols-sm="4"
      />
      <bk-submit @cancel="onCancel" v-bind="$attrs"/>
    </b-overlay>
  </b-form>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import I18n from "../../../../lib/classes/i18n"
import { User } from "meteor/a-kyma:bk"
import BkSubmit from "./BkSubmit";

export default {
  name: "BkSubscribe",
  components: {BkSubmit},
  props: {
    model: Class,
    modal: String,
    fields: {
      type: [Array,String]
    },
  },
  data() {
    return {
      showOverlay: false,
      showAlert: false,
      formModel: this.model || this.user,
    }
  },
  provide() {
    return {
      formModel: this.formModel
    }
  },
  created() {

  },
  computed: {
    requiredFields() {
      return this.fields || this.user.profile.constructor.getFieldsNamesByFilter({required: true});
    },
  },
  meteor: {
    globalError() {
      return this.formModel.getError('MeteorError');
    },
    user() {return new User({profile: {language: I18n.getLanguage()} }) },
  },
  methods: {
    showSuccess() {
      // Toast launched from $root to avoid its destruction while leaving this page
      this.$root.$bvToast.toast(I18n.t("app.success"),{
        title: I18n.t("app.toast.title.success"),
        variant: "success",
        autoHideDelay: 5000
      })
    },
    onSubmit(e) {
      e.preventDefault()
      let self = this;
      self.showOverlay=true;
      let model = this.formModel;

      model.createUserFromClient(function(err,id) {
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
          let s=new Event("submitSuccess");
          self.$emit("submitSuccess",s,self,model)
          if (self.formModel.profile?.password)
            Meteor.loginWithPassword(self.formModel.profile.email, self.formModel.profile.password);
          if (self.modal) {
            self.$bvModal.hide(self.modal)
          } else {
            self.$router.push("/");
          }
        }
      })
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