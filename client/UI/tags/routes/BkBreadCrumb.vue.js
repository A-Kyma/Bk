

    const _sfc_main = {
        name: "BkBreadCrumb",
        computed: {
            RouteArray() {
                if (this.$route.matched.length > 0){
                    let routeStr = this.$route.matched[0].path.substring(1);
                    let param = this.$route.params
                    let title = this.$route.meta.title
                    if (routeStr !== ""){
                        let routeArr = routeStr.split("/");
                        if (routeArr.length > 0){
                            for (let i = 0; i < routeArr.length; i++) {
                                if (routeArr[i].indexOf(":") > -1){
                                    if(routeArr[i] === ":id"){
                                        if (title.indexOf(".") > -1){
                                            routeArr[i] = title
                                        }else{
                                            routeArr[i] = "route." + title + ".title"
                                        }

                                    }else{
                                        let paramValue = param[routeArr[i].replace(":","")]
                                        routeArr[i] = "route." + paramValue + ".title"
                                    }
                                }else{
                                    routeArr[i] = "route." + routeArr[i] + ".title"
                                }
                            }
                            return routeArr;
                        }
                    }
                }

            }
        },
    }


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, createTextVNode as _createTextVNode, withCtx as _withCtx, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createBlock as _createBlock } from "vue/dist/vue.runtime.esm-bundler.js"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_t = _resolveComponent("t")
  const _component_b_breadcrumb_item = _resolveComponent("b-breadcrumb-item")
  const _component_b_breadcrumb = _resolveComponent("b-breadcrumb")

  return (_openBlock(), _createBlock(_component_b_breadcrumb, null, {
    default: _withCtx(() => [
      _createVNode(_component_b_breadcrumb_item, { to: "/" }, {
        default: _withCtx(() => [
          _createVNode(_component_b_icon, {
            icon: "house-fill",
            scale: "1.25",
            "shift-v": "1.25",
            "aria-hidden": "true"
          }),
          _createVNode(_component_t, null, {
            default: _withCtx(() => [...(_cache[0] || (_cache[0] = [
              _createTextVNode("route.home.title", -1 /* CACHED */)
            ]))]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }),
      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($options.RouteArray, (item) => {
        return (_openBlock(), _createBlock(_component_b_breadcrumb_item, { active: "" }, {
          default: _withCtx(() => [
            _createVNode(_component_t, null, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(item), 1 /* TEXT */)
              ]),
              _: 2 /* DYNAMIC */
            }, 1024 /* DYNAMIC_SLOTS */)
          ]),
          _: 2 /* DYNAMIC */
        }, 1024 /* DYNAMIC_SLOTS */))
      }), 256 /* UNKEYED_FRAGMENT */))
    ]),
    _: 1 /* STABLE */
  }))
}
_sfc_main.render = render;
