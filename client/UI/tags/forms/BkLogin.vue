<template>
  <span v-if="!!loggedUser">
    {{loggedUser.defaultName()}}
    [<b-link @click="onDisconnect"><t>app.user.login.disconnect</t></b-link>]
  </span>

  <bk-form v-else-if="passwordForgotten"
           v-bind="{...$props,...$attrs}"
           :model="user"
           for="forgottenPassword"
           @submit="onSubmitForgotten"
           @cancel="onCancelForgotten"
           :excludeButtons="['reset']">
    <bk-field-list
        v-bind="$attrs"
        :model="user.profile"
        fields="email"/>
  </bk-form>

  <bk-form v-else
           v-bind="{...$props,...$attrs}"
           :model="user"
           for="login"
           @submit="onSubmit"
           :excludeButtons="['reset','cancel']">
    <template v-slot:login-title>
      <h2><t>{{title}}</t></h2>
    </template>
    <bk-field-list
        v-bind="$attrs"
        :model="user.profile"
        fields="email,password"/>
    <b-link @click="onPasswordForgotten"><t>app.user.forgotPassword</t></b-link>
  </bk-form>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import BkForm from "./BkForm"
import { User } from "meteor/a-kyma:bk"
import { Accounts } from "meteor/accounts-base"

export default {
  name: "BkLogin",
  components: {BkForm},
  data() {
    return {
      user: new User(),
      passwordForgotten: false,
    }
  },
  computed: {
    title() {
      return "app.user.login.title";
    }
  },
  meteor: {
    loggedUser() { return Meteor.user() && new User(Meteor.user()) }
  },
  methods: {
    onDisconnect(e) {
      e.preventDefault();
      Meteor.logout()
    },
    onPasswordForgotten(e) {
      e.preventDefault();
      this.passwordForgotten=true;
    },
    onSubmitForgotten(e,vmForm) {
      e.preventDefault()
      const profile = this.user.profile
      if (!profile.isValid(["email"])) return

      vmForm.hideFail();
      vmForm.showOverlay();

      Accounts.forgotPassword({email:profile.email},(err) => {
        vmForm.hideOverlay()
        if (err) {
          this.user.setError(err);
          vmForm.showFail()
        } else {
          vmForm.showSuccess("app.user.mail.success")
          this.passwordForgotten=false
        }
      })
    },
    onCancelForgotten(e) {
      e.preventDefault()
      this.passwordForgotten=false
    },
    onSubmit(e,vmForm) {
      self=this;
      // Avoid BkForm usage and classic html submission reloading the page
      e.preventDefault();

      const profile = this.user.profile

      if (!profile.isValid(["email","password"])) return
      vmForm.hideFail();
      vmForm.showOverlay();

      Meteor.loginWithPassword(profile.email,profile.password,(err) => {
        vmForm.hideOverlay()
        if (err) {
          this.user.setError(err);
          vmForm.showFail()
        } else {
          vmForm.showSuccess("app.user.login.success")
        }
      })
    },
  },
}
</script>

<style scoped>

</style>