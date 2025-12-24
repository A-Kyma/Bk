
import {Class} from "meteor/akyma:astronomy"
import {DateTime,I18n} from "meteor/akyma:bk"


const _sfc_main = {
  name: "BkDatePicker",
  props: {
    state: Boolean,
    for: String,
    placeholder: String,
    plaintext: Boolean,
    value: Date,
  },
  created() {
    if (this.readonly) return
    let minute = this.value.getMinutes()
    let remainder = minute % 5
    if (remainder !== 0) {
      minute = minute + 5 - remainder
      this.value.setMinutes(minute)
      let d = DateTime.getISODateString(this.value)
      let h = this.timeValue
      this.$emit("input",`${d}T${h}`)
    }


  },
  computed: {
    readonly() {
      return (this.plaintext || this.$props.for === "view")
    },
    dateValue: {
      set(value) {
        let newValue
        if (value === undefined || value === "")
          newValue = undefined
        else
          if (this.timeValue === undefined)
            newValue = value + "T00:00"
          else
            newValue = value + "T" + this.timeValue //,{cast: true}
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return this.value
      }
    },
    timeValue: {
      set(value) {
        if (value === undefined || value === "") return
        let d = DateTime.getISODateString(this.value)
        let newValue = d + "T" + value
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return DateTime.getTime(this.value)
      }
    },
    readonlyValue() {
      return DateTime.getLongDateTime(this.value,this.locale)
    }
  },
  meteor: {
    labelClose() {
      return I18n.get("app.close")
    },
    locale() {
      return I18n.getLanguage()
    }
  },
  methods: {
    selectTime() {

    }
  },
}


export default _sfc_main;

import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { class: "col-12 pl-0 pr-0" }
const _hoisted_2 = {
  key: 0,
  class: "form-control-plaintext"
}

function render(_ctx, _cache) {
  const _component_b_form_datepicker = _resolveComponent("b-form-datepicker")
  const _component_b_col = _resolveComponent("b-col")
  const _component_b_form_timepicker = _resolveComponent("b-form-timepicker")
  const _component_b_row = _resolveComponent("b-row")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (_ctx.readonly)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, _toDisplayString(_ctx.readonlyValue), 1 /* TEXT */))
      : (_openBlock(), _createBlock(_component_b_row, { key: 1 }, {
          default: _withCtx(() => [
            _createVNode(_component_b_col, {
              lg: "8",
              md: "12",
              class: "nopaddingleft"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_b_form_datepicker, {
                  ref: "datepicker",
                  modelValue: _ctx.dateValue,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.dateValue) = $event)),
                  locale: _ctx.locale,
                  placeholder: _ctx.placeholder,
                  state: _ctx.state,
                  disabled: _ctx.plaintext,
                  "start-weekday": "1",
                  onHidden: _ctx.selectTime
                }, null, 8 /* PROPS */, ["modelValue", "locale", "placeholder", "state", "disabled", "onHidden"])
              ]),
              _: 1 /* STABLE */
            }),
            _createVNode(_component_b_col, { class: "nopaddingleft" }, {
              default: _withCtx(() => [
                _createVNode(_component_b_form_timepicker, {
                  ref: "timepicker",
                  modelValue: _ctx.timeValue,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.timeValue) = $event)),
                  locale: _ctx.locale,
                  placeholder: "HH:mm",
                  "minutes-step": "5",
                  state: _ctx.state,
                  disabled: _ctx.plaintext || _ctx.dateValue===undefined,
                  "label-close-button": _ctx.labelClose
                }, null, 8 /* PROPS */, ["modelValue", "locale", "state", "disabled", "label-close-button"])
              ]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }))
  ]))
}
_sfc_main.render = render;
