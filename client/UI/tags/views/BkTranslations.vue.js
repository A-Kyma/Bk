
import {Class} from "meteor/akyma:astronomy"
import {I18n} from "meteor/akyma:bk"
import {dump} from "js-yaml/dist/js-yaml.mjs"

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const _sfc_main = {
  name: "BkTranslations",
  props: {
    locales: {
      type: Array,
      default() {return I18n.locales}
    },
  },
  computed: {
    availableKeys() {
      let result=[]
      for (let [key,value] of Object.entries(this.translationsList)) {
        let realKey = key.split(".").slice(1).join(".")
        result.push(realKey)
      }
      return result.filter((item,index) => result.indexOf(item) === index).sort()
    },
    fields(){
      return ["_id"].concat(this.locales)
    },
    array() {
      let result=[]
      this.availableKeys.forEach(key => {
        let elem = {_id: key, overlay: false}
        this.locales.forEach(locale => {
          elem[locale] = this.translationsList[locale + "." + key]
        })
        result.push(elem)
      })
      return result
    }
  },
  meteor: {
    translationsList() {
      return I18n.map.all()
    },
  },
  methods: {
    saveTranslation(model,locale,event) {
      const value = event.target.value
      const id = locale + "." + model._id
      if (this.translationsList[id] === value) return
      if (this.translationsList[id] === undefined && value ==="") return

      console.log("Saving: ",id,value)
      I18n.map.set(id,value)
      this.toggleState(model,locale,true)
    },
    toggleState(model,locale,value) {
      const ref = "input-" + locale + "." + model._id
      this.$refs[ref].state = value
    },
    generateYml() {
      const yml = dump(
          I18n.convertToObjectTranslations(this.translationsList),
          { sortKeys: true, quotingType: '"', forceQuotes: true }
      )
      //console.log(yml)
      download("translations.yml",yml)
    },
    onTranslate(model,locale) {
      model.overlay = locale
      Meteor.call("deeplTranslate", model.fr, locale, (err,result) => {
        if (result) {
          model[locale] = result
          this.saveTranslation(model,locale,{target: {value: result}})
        }
        model.overlay = false
      })
    }
  }
}


export default _sfc_main;

import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "translationkey" }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_form_input = _resolveComponent("b-form-input")
  const _component_b_icon_translate = _resolveComponent("b-icon-translate")
  const _component_b_link = _resolveComponent("b-link")
  const _component_b_input_group_text = _resolveComponent("b-input-group-text")
  const _component_b_input_group_append = _resolveComponent("b-input-group-append")
  const _component_b_input_group = _resolveComponent("b-input-group")
  const _component_b_overlay = _resolveComponent("b-overlay")
  const _component_bk_table = _resolveComponent("bk-table")

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_b_button, {
      variant: "primary",
      onClick: $options.generateYml
    }, {
      default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
        _createTextVNode(" Generate YAML ", -1 /* CACHED */)
      ]))]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["onClick"]),
    _createVNode(_component_bk_table, {
      model: "I18n",
      array: $options.array,
      fields: $options.fields,
      "per-page": 1000
    }, {
      "head()": _withCtx(({field}) => [
        _createTextVNode(_toDisplayString(field), 1 /* TEXT */)
      ]),
      "cell(_id)": _withCtx(({model,field}) => [
        _createElementVNode("div", _hoisted_1, _toDisplayString(model[field]), 1 /* TEXT */)
      ]),
      "cell()": _withCtx(({model,field}) => [
        _createVNode(_component_b_overlay, {
          show: model.overlay === field,
          rounded: "",
          opacity: "0.6",
          "spinner-small": "",
          "spinner-variant": "primary"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_b_input_group, null, {
              default: _withCtx(() => [
                _createVNode(_component_b_form_input, {
                  id: field + '.' + model._id,
                  ref: 'input-'+field+'.'+model._id,
                  tabindex: $props.locales.indexOf(field)+1,
                  type: "text",
                  modelValue: model[field],
                  "onUpdate:modelValue": $event => ((model[field]) = $event),
                  lazy: "",
                  onFocus: $event => ($options.toggleState(model,field,null)),
                  onBlur: $event => ($options.saveTranslation(model,field,$event))
                }, null, 8 /* PROPS */, ["id", "tabindex", "modelValue", "onUpdate:modelValue", "onFocus", "onBlur"]),
                (field!=='fr')
                  ? (_openBlock(), _createBlock(_component_b_input_group_append, { key: 0 }, {
                      default: _withCtx(() => [
                        _createVNode(_component_b_input_group_text, null, {
                          default: _withCtx(() => [
                            _createVNode(_component_b_link, {
                              alt: "translate",
                              onClick: $event => ($options.onTranslate(model,field))
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_b_icon_translate, { variant: "primary" })
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["onClick"])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1024 /* DYNAMIC_SLOTS */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1024 /* DYNAMIC_SLOTS */))
                  : _createCommentVNode("v-if", true)
              ]),
              _: 2 /* DYNAMIC */
            }, 1024 /* DYNAMIC_SLOTS */)
          ]),
          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["show"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["array", "fields"])
  ]))
}
_sfc_main.render = render;
