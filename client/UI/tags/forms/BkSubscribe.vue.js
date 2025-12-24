
import { Class } from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n"
import { User } from "meteor/akyma:bk"
import BkSubmit from "./BkSubmit.vue.js";

const _sfc_main = {
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


export default _sfc_main;

import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, mergeProps as _mergeProps, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_b_alert = _resolveComponent("b-alert")
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_bk_submit = _resolveComponent("bk-submit")
  const _component_b_overlay = _resolveComponent("b-overlay")
  const _component_b_form = _resolveComponent("b-form")

  return (_openBlock(), _createBlock(_component_b_form, {
    ref: "form",
    onSubmit: _ctx.onSubmit
  }, {
    default: _withCtx(() => [
      _createVNode(_component_b_overlay, { show: _ctx.showOverlay }, {
        default: _withCtx(() => [
          _createVNode(_component_b_alert, {
            show: _ctx.showAlert,
            variant: "danger",
            fade: "",
            dismissible: "",
            onDismissed: _cache[0] || (_cache[0] = $event => (_ctx.showAlert=false))
          }, {
            default: _withCtx(() => [
              _createVNode(_component_t, null, {
                default: _withCtx(() => [...(_cache[1] || (_cache[1] = [
                  _createTextVNode("app.failed", -1 /* CACHED */)
                ]))]),
                _: 1 /* STABLE */
              }),
              _cache[2] || (_cache[2] = _createElementVNode("br", null, null, -1 /* CACHED */)),
              (!!_ctx.globalError)
                ? (_openBlock(), _createElementBlock("span", _hoisted_1, [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_ctx.globalError), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]))
                : _createCommentVNode("v-if", true)
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["show"]),
          _createVNode(_component_bk_field_list, _mergeProps({..._ctx.$props,..._ctx.$attrs}, {
            model: _ctx.formModel.profile,
            fields: _ctx.requiredFields,
            for: "new",
            variant: "secondary",
            size: "sm",
            "label-cols-sm": "4"
          }), null, 16 /* FULL_PROPS */, ["model", "fields"]),
          _createVNode(_component_bk_submit, _mergeProps({ onCancel: _ctx.onCancel }, _ctx.$attrs), null, 16 /* FULL_PROPS */, ["onCancel"])
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["show"])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["onSubmit"]))
}
_sfc_main.render = render;
