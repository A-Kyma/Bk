
import {Class} from "meteor/akyma:astronomy"
import BkForm from "./BkForm.vue.js"
import BkTranslate from "../translation/BkTranslate.vue.js"
import { User } from "meteor/akyma:bk"
import { Accounts } from "meteor/accounts-base"

const _sfc_main = {
  name: "BkLogin",
  components: {BkForm, t: BkTranslate},
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
          this.$emit("loggedin")
        }
      })
    },
  },
}


export default _sfc_main;

import { toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, mergeProps as _mergeProps, createBlock as _createBlock, createElementVNode as _createElementVNode } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_t = _resolveComponent("t")
  const _component_b_link = _resolveComponent("b-link")
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_bk_form = _resolveComponent("bk-form")

  return (!!_ctx.loggedUser)
    ? (_openBlock(), _createElementBlock("span", _hoisted_1, [
        _createTextVNode(_toDisplayString(_ctx.loggedUser.defaultName()) + " [", 1 /* TEXT */),
        _createVNode(_component_b_link, { onClick: $options.onDisconnect }, {
          default: _withCtx(() => [
            _createVNode(_component_t, null, {
              default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
                _createTextVNode("app.user.login.disconnect", -1 /* CACHED */)
              ]))]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["onClick"]),
        _cache[1] || (_cache[1] = _createTextVNode("] ", -1 /* CACHED */))
      ]))
    : ($data.passwordForgotten)
      ? (_openBlock(), _createBlock(_component_bk_form, _mergeProps({ key: 1 }, {..._ctx.$props,..._ctx.$attrs}, {
          model: $data.user,
          for: "forgottenPassword",
          onSubmit: $options.onSubmitForgotten,
          onCancel: $options.onCancelForgotten,
          excludeButtons: ['reset']
        }), {
          default: _withCtx(() => [
            _createVNode(_component_bk_field_list, _mergeProps(_ctx.$attrs, {
              model: $data.user.profile,
              fields: "email"
            }), null, 16 /* FULL_PROPS */, ["model"])
          ]),
          _: 1 /* STABLE */
        }, 16 /* FULL_PROPS */, ["model", "onSubmit", "onCancel"]))
      : (_openBlock(), _createBlock(_component_bk_form, _mergeProps({ key: 2 }, {..._ctx.$props,..._ctx.$attrs}, {
          model: $data.user,
          for: "login",
          onSubmit: $options.onSubmit,
          excludeButtons: ['reset','cancel']
        }), {
          "login-title": _withCtx(() => [
            _createElementVNode("h2", null, [
              _createVNode(_component_t, null, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString($options.title), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              })
            ])
          ]),
          default: _withCtx(() => [
            _createVNode(_component_bk_field_list, _mergeProps(_ctx.$attrs, {
              model: $data.user.profile,
              fields: "email,password"
            }), null, 16 /* FULL_PROPS */, ["model"]),
            _createVNode(_component_b_link, { onClick: $options.onPasswordForgotten }, {
              default: _withCtx(() => [
                _createVNode(_component_t, null, {
                  default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                    _createTextVNode("app.user.forgotPassword", -1 /* CACHED */)
                  ]))]),
                  _: 1 /* STABLE */
                })
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["onClick"])
          ]),
          _: 1 /* STABLE */
        }, 16 /* FULL_PROPS */, ["model", "onSubmit"]))
}
_sfc_main.render = render;
