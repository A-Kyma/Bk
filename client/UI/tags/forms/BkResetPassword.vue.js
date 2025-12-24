
import { Class } from "meteor/akyma:astronomy"
import { User } from "meteor/akyma:bk"
import BkForm from "./BkForm.vue.js"
import { Accounts } from "meteor/accounts-base"

const _sfc_main = {
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


export default _sfc_main;

import { toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createElementVNode as _createElementVNode, mergeProps as _mergeProps, openBlock as _openBlock, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_bk_form = _resolveComponent("bk-form")

  return (_openBlock(), _createBlock(_component_bk_form, _mergeProps({..._ctx.$props,..._ctx.$attrs}, {
    model: _ctx.user,
    onSubmit: _ctx.onSubmit,
    excludeButtons: ['reset'],
    class: "col-lg-10 col-xl-8"
  }), {
    default: _withCtx(() => [
      _createElementVNode("h2", null, [
        _createVNode(_component_t, null, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(_ctx.title), 1 /* TEXT */)
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _createVNode(_component_bk_field_list, _mergeProps(_ctx.$attrs, {
        model: _ctx.user.profile,
        fields: "password,passwordConfirmation"
      }), null, 16 /* FULL_PROPS */, ["model"])
    ]),
    _: 1 /* STABLE */
  }, 16 /* FULL_PROPS */, ["model", "onSubmit"]))
}
_sfc_main.render = render;
