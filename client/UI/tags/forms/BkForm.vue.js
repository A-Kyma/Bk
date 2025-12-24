
import {Class} from "meteor/akyma:astronomy";
import {I18n} from "meteor/akyma:bk"
import BkFieldList from "./BkFieldList.vue.js";
import BkSubmit from "./BkSubmit.vue.js";

const _sfc_main = {
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
      meteorMethodArgs: {
        type: Array,
        default() { return []}
      },
      validateServerSide: {
        type: Boolean,
        default: false
      }
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
      },
      allErrorsArray() {
        return Object.values(this.formModel.getError()).flat()
      },
      allErrorsOnHiddenFields() {
        if (!!this.globalError) return []
        return this.allErrorsArray.filter(e => !this.formModel.canView(e.name))
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

        // Save only fields that are declared to be shown in the form
        let fields = model.constructor.getFieldsNamesByFilter({
          fields: self.$attrs.fields,
          exclude: self.$attrs.exclude
        })

        let callback = function(err,id) {
          self.hideOverlay();
            if (err) {
              let f=new Event("submitFailed",{cancelable: true});
              self.$emit("submitFailed",f,self,model,err)
              if (f.defaultPrevented) return

              // TODO: check if field is in the form, hence show error in global instead of local for field

              model.setError(err);
              self.showAlert = true;
              // Scroll to alert after DOM was updated
              self.$nextTick(() => {
                self.$refs.form.scrollIntoView({behavior: "smooth"});
              })
            } else {
              self.showAlert = false;
              self.showSuccess()

              let s=new Event("submitSuccess", {cancelable: true});
              self.$emit("submitSuccess",s,self,model)
              if (s.defaultPrevented) return

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
          model.applyMethod(this.meteorMethod,this.meteorMethodArgs,callback)
        } else {
          model.save({fields, stopOnFirstError:false, simulation: this.simulation},callback)
        }
        //this.formModel.set(model)
      },
      onReset(e) {
        this.$emit("reset",e,this,this.model);
        // Allow catching the event on components using this tag
        if (e.defaultPrevented) return;
        e.preventDefault()
        this.showAlert = false;
        this.formModel.clearError();

        if (this.formModel.isPersisted())
          this.formModel.reload()
        else {
          let newModel = new (this.formModel.constructor)()
          this.formModel.set(newModel.raw())
        }
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
      }
    },
  }


export default _sfc_main;

import { renderSlot as _renderSlot, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, renderList as _renderList, Fragment as _Fragment, mergeProps as _mergeProps, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, createSlots as _createSlots, createBlock as _createBlock, withModifiers as _withModifiers, withKeys as _withKeys } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }

function render(_ctx, _cache) {
  const _component_t = _resolveComponent("t")
  const _component_b_alert = _resolveComponent("b-alert")
  const _component_bk_field_list = _resolveComponent("bk-field-list")
  const _component_bk_submit = _resolveComponent("bk-submit")
  const _component_b_overlay = _resolveComponent("b-overlay")
  const _component_b_form = _resolveComponent("b-form")

  return (_openBlock(), _createBlock(_component_b_form, _mergeProps({ ref: "form" }, _ctx.$attrs, {
    inline: _ctx.inline,
    onSubmit: _ctx.onSubmit,
    onKeyup: [
      _withKeys(_withModifiers(_ctx.onSubmit, ["ctrl"]), ["enter"]),
      _withKeys(_withModifiers(_ctx.onSubmit, ["meta"]), ["enter"])
    ],
    onReset: _ctx.onReset
  }), {
    default: _withCtx(() => [
      _createVNode(_component_b_overlay, { show: _ctx.isOverlay }, {
        overlay: _withCtx(() => [
          _renderSlot(_ctx.$slots, "overlay")
        ]),
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
                default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                  _createTextVNode("app.failed", -1 /* CACHED */)
                ]))]),
                _: 1 /* STABLE */
              }),
              _createCommentVNode(" Show global error thrown by Meteor.Error "),
              _cache[3] || (_cache[3] = _createElementVNode("br", null, null, -1 /* CACHED */)),
              (!!_ctx.globalError)
                ? (_openBlock(), _createElementBlock("span", _hoisted_1, [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_ctx.globalError), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]))
                : _createCommentVNode("v-if", true),
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.allErrorsOnHiddenFields, (error) => {
                return (_openBlock(), _createElementBlock("div", {
                  key: error.name
                }, [
                  _createElementVNode("span", null, [
                    _createVNode(_component_t, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(error.message), 1 /* TEXT */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1024 /* DYNAMIC_SLOTS */),
                    _createTextVNode(" (" + _toDisplayString(error.value) + ")", 1 /* TEXT */)
                  ])
                ]))
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["show"]),
          _renderSlot(_ctx.$slots, "default", _mergeProps({..._ctx.$props,..._ctx.$attrs}, { model: _ctx.formModel }), () => [
            _createVNode(_component_bk_field_list, _mergeProps(_ctx.$attrs, {
              model: _ctx.formModel,
              for: _ctx.$props['for'],
              onChange: _ctx.onChangeInput,
              onTag: _cache[1] || (_cache[1] = $event => (_ctx.$emit('tag',$event))),
              "validate-server-side": _ctx.validateServerSide
            }), _createSlots({ _: 2 /* DYNAMIC */ }, [
              _renderList(_ctx.$scopedSlots, (_, slot) => {
                return {
                  name: slot,
                  fn: _withCtx((props) => [
                    _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                  ])
                }
              })
            ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["model", "for", "onChange", "validate-server-side"])
          ]),
          _renderSlot(_ctx.$slots, "after-form", _normalizeProps(_guardReactiveProps({..._ctx.$props,..._ctx.$attrs, model: _ctx.formModel}))),
          _renderSlot(_ctx.$slots, "formButtons", _normalizeProps(_guardReactiveProps({..._ctx.$props,..._ctx.$attrs, model: _ctx.formModel})), () => [
            (!_ctx.modal)
              ? (_openBlock(), _createBlock(_component_bk_submit, _mergeProps({ key: 0 }, _ctx.$attrs, {
                  for: _ctx.submitFor,
                  toast: _ctx.toast,
                  onCancel: _ctx.onCancel
                }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                  _renderList(_ctx.$scopedSlots, (_, slot) => {
                    return {
                      name: slot,
                      fn: _withCtx((props) => [
                        _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                      ])
                    }
                  })
                ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["for", "toast", "onCancel"]))
              : _createCommentVNode("v-if", true)
          ])
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["show"])
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */, ["inline", "onSubmit", "onKeyup", "onReset"]))
}
_sfc_main.render = render;
