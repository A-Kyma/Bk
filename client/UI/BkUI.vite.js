// Vite-only entry for BkUI (imports .vue files)
import _startsWith from 'lodash/startsWith';
import configure from "./configure";

// Import only the components needed (extend as required)
import BkLabel from "./tags/forms/BkLabel.vue";
import BkTranslate from "./tags/translation/BkTranslate.vue";

const BkUI = {
  BkTranslate,
  BkLabel
};

BkUI.install = function (app, config = {}) {
  const registerComponent = (Component) => {
    const Comp = (Component && Component.default) ? Component.default : Component;
    const name = Comp && Comp.name ? Comp.name : null;
    if (!name) return;

    if (app && typeof app.component === 'function') {
      app.component(name, Comp);
      return;
    }

    if (typeof window !== 'undefined' && window.Vue && typeof window.Vue.component === 'function') {
      window.Vue.component(name, Comp);
      return;
    }

    console.warn('BkUI: unable to register component', name);
  };

  Object.keys(config).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      if (BkUI[key] === undefined) {
        return;
      }

      const Component = BkUI[key];
      const props = config[key];

      configure(Component, props);
    }
  });

  if (app && typeof app.mixin === 'function') {
    app.mixin({
      computed: {
        $scopedSlots() { return this.$slots || {}; }
      }
    });
  } else if (typeof window !== 'undefined' && window.Vue && typeof window.Vue.mixin === 'function') {
    window.Vue.mixin({
      computed: {
        $scopedSlots() { return this.$scopedSlots || this.$slots || {}; }
      }
    });
  }

  Object.keys(BkUI).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      const Component = BkUI[key];
      registerComponent(Component);
    }
  });
};

export default BkUI;
