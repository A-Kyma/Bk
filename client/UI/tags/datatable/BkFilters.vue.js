
const _sfc_main = {
  name: "BkFilters"
}


export default _sfc_main;

import { createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createStaticVNode as _createStaticVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { class: "row p-3 bg-secondary filters" }
const _hoisted_2 = { class: "col-md-10 offset-md-1 filter-form" }
const _hoisted_3 = { class: "justify-content-md-center mt-1 form-inline" }

function render(_ctx, _cache) {
  const _component_b_button = _resolveComponent("b-button")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("form", _hoisted_3, [
        _cache[1] || (_cache[1] = _createStaticVNode("<div class=\"search-header\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><input id=\"inline-form-input-city\" type=\"text\" placeholder=\"Select a Town\" class=\"mb-1 mr-1 form-control\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><select id=\"inline-form-custom-select-status\" class=\"mb-1 mr-1 custom-select\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><option value=\"all\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Status</option><option value=\"Draft\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Draft</option><option value=\"Published\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Published</option></select><select id=\"inline-form-custom-select-buy\" class=\"mb-1 mr-1 custom-select\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><option value=\"all\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Buy or Rent</option><option value=\"Buy\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Buy</option><option value=\"Rent\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Rent</option></select><select id=\"inline-form-custom-select-type\" class=\"mb-1 mr-1 custom-select\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><option value=\"All\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Type</option><option value=\"House\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>House</option><option value=\"Apartment\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Apartment</option><option value=\"Bungalow\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue>Bungalow</option></select><input id=\"inline-form-input-minprice\" type=\"text\" placeholder=\"Price\" class=\"mb-1 mr-1 resized form-control\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue><input id=\"inline-form-input-ref\" type=\"text\" placeholder=\"ImmoBe Ref\" class=\"mb-1 mr-1 resized form-control\" data-v-/Users/arnaud/A-Kyma/meteor/releases/v3/Bk/client/UI/tags/datatable/BkFilters.vue></div>", 1)),
        _createCommentVNode("        <b-button v-b-toggle.sidebar-variant class=\"mb-1 mr-1\">More criteria +</b-button>"),
        _createVNode(_component_b_button, {
          class: "btn-search mb-1",
          href: "/search"
        }, {
          default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
            _createTextVNode("Search", -1 /* CACHED */)
          ]))]),
          _: 1 /* STABLE */
        })
      ])
    ])
  ]))
}
_sfc_main.render = render;
