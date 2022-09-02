<template>
  <bk-form v-bind="{...$props,...$attrs}" :model="user" @submit="onSubmit"
           :excludeButtons="['reset']" class="col-lg-10 col-xl-8">
    <h2><t>{{title}}</t></h2>
    <bk-field-list
        v-bind="$attrs"
        :model="user.profile"
        fields="password,passwordConfirmation"/>
  </bk-form>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { User } from "meteor/akyma:bk"
import BkForm from "./BkForm"
import { Accounts } from "meteor/accounts-base"

export default {
  name: "BkResetPassword",
  components: {BkForm},
  props: {
    for: {
      type: String,
      default: "edit"
    },
  },
  data() {
    return {
      user: new User(),
    }
  },
  computed: {
    title() {
      if (this.$props["for"] === "new") return "app.user.createPassword"
      return "app.user.resetPassword";
    }
  },
  methods: {
    onSubmit(e,vmForm) {
      self=this;
      // Avoid BkForm usage and classic html submission reloading the page
      e.preventDefault();

      if (!this.user.profile.isValid(["password","passwordConfirmation"])) return
      vmForm.hideFail();
      vmForm.showOverlay();

      Accounts.resetPassword(this.$route.params.token,this.user.profile.password,(err,result) => {
        vmForm.hideOverlay()
        if (err) {
          this.user.setError(err);
          vmForm.showFail()
        } else {
          vmForm.showSuccess()
          this.$router.push("/");
        }
      })
    }
  },
}
</script>

<style scoped>

</style>