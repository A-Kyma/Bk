
  import {Class} from "meteor/akyma:astronomy"
  import I18n from "../../../../lib/classes/i18n";
  import Languages from "../../../../lib/modules/customFields/types/language";
  import config from "../../../../lib/core/config";


  const _sfc_main = {
    name: "BkLanguage",
    props: {
      view: {
        type: String,
        default: "dropdown"
      },
    },
    data() {
      return {
        active: I18n.getLanguage(),
      }
    },
    computed: {
      locales() {
        return Meteor.settings?.public?.translation?.locales || config.translation.locales;
      }
    },
    methods: {
      isActive(lang) {
        return this.active === lang;
      },
      translate(lang) {
        return Languages.getLabelKey(lang);
      },
      getLang(){
        return this.active
      },
      onClick(lang,close) {
        this.$emit("change",lang)
        I18n.setLanguage(lang);
        this.active = lang;
        if (close) this.$refs.flagdropdown.hide(true)
      }
    },
    meteor: {
    }
  }


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, withCtx as _withCtx, createBlock as _createBlock, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass, createElementVNode as _createElementVNode } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 2 }

function render(_ctx, _cache) {
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_t = _resolveComponent("t")
  const _component_b_dropdown_item = _resolveComponent("b-dropdown-item")
  const _component_b_nav_item_dropdown = _resolveComponent("b-nav-item-dropdown")
  const _component_b_link = _resolveComponent("b-link")
  const _component_b_col = _resolveComponent("b-col")
  const _component_b_row = _resolveComponent("b-row")
  const _component_b_navbar_nav = _resolveComponent("b-navbar-nav")

  return (_ctx.view==='dropdown')
    ? (_openBlock(), _createBlock(_component_b_nav_item_dropdown, {
        key: 0,
        right: ""
      }, {
        "button-content": _withCtx(() => [
          _createVNode(_component_b_icon, { icon: "flag-fill" })
        ]),
        default: _withCtx(() => [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.locales, (lang) => {
            return (_openBlock(), _createBlock(_component_b_dropdown_item, {
              active: _ctx.isActive(lang),
              onClick: $event => (_ctx.onClick(lang))
            }, {
              default: _withCtx(() => [
                _createVNode(_component_t, null, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(_ctx.translate(lang)), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1024 /* DYNAMIC_SLOTS */)
              ]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["active", "onClick"]))
          }), 256 /* UNKEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      }))
    : (_ctx.view==='flags')
      ? (_openBlock(), _createBlock(_component_b_row, { key: 1 }, {
          default: _withCtx(() => [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.locales, (lang) => {
              return (_openBlock(), _createBlock(_component_b_col, { class: "p-0" }, {
                default: _withCtx(() => [
                  _createVNode(_component_b_link, {
                    onClick: $event => (_ctx.onClick(lang,true))
                  }, {
                    default: _withCtx(() => [
                      _createElementVNode("span", {
                        class: _normalizeClass('fi fi-'+lang)
                      }, null, 2 /* CLASS */)
                    ]),
                    _: 2 /* DYNAMIC */
                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
                ]),
                _: 2 /* DYNAMIC */
              }, 1024 /* DYNAMIC_SLOTS */))
            }), 256 /* UNKEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        }))
      : (_ctx.view==='nav')
        ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
            _createVNode(_component_b_navbar_nav, null, {
              default: _withCtx(() => [
                _createVNode(_component_b_nav_item_dropdown, {
                  ref: "flagdropdown",
                  class: "flag-dropdown"
                }, {
                  "button-content": _withCtx(() => [
                    _createElementVNode("span", {
                      class: _normalizeClass('flags rounded-circle flags fi-1x1-'+_ctx.active)
                    }, null, 2 /* CLASS */)
                  ]),
                  default: _withCtx(() => [
                    (_ctx.lang !== _ctx.active)
                      ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(_ctx.locales, (lang) => {
                          return (_openBlock(), _createBlock(_component_b_dropdown_item, {
                            onClick: $event => (_ctx.onClick(lang)),
                            class: "flag-item"
                          }, {
                            default: _withCtx(() => [
                              _createElementVNode("span", {
                                class: _normalizeClass('rounded-circle flags fi-1x1-'+lang)
                              }, null, 2 /* CLASS */)
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"]))
                        }), 256 /* UNKEYED_FRAGMENT */))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _: 1 /* STABLE */
                }, 512 /* NEED_PATCH */)
              ]),
              _: 1 /* STABLE */
            })
          ]))
        : _createCommentVNode("v-if", true)
}
_sfc_main.render = render;
