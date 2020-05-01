// for VueJS
import _startsWith from 'lodash/startsWith';
import configure from "./configure";

/*** To make VueJS works :
 * See https://guide.meteor.com/vue.html#introduction
 * It's needed to install:
 meteor npm install --save vue
 meteor npm install --save vue-meteor-tracker
 meteor npm install vue bootstrap-vue bootstrap
 * Since we depends on BootstrapVue, you will need to do in the main.js
 // for VueJS
 import Vue from "vue";
 import VueMeteorTracker from 'vue-meteor-tracker';
 import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
 import { BkUI } from 'meteor/a-kyma:bk';
 Vue.use(VueMeteorTracker);
 Vue.use(BootstrapVue);
 Vue.use(IconsPlugin);
 Vue.use(BkUI);

 import 'bootstrap/dist/css/bootstrap.css'
 import 'bootstrap-vue/dist/bootstrap-vue.css'

 And then, attach Vue to a DOM id:
 new Vue({
    el: '#app',
    ...App,
  })
***/

/*
All tags has to be imported here and should begins with "Bk".

 */
import BkInput from "./tags/inputs/BkInput";

const BkUI = {
  BkInput
}

BkUI.install = function (Vue, config = {}) {
  // Configure the component props if config provided
//  import BkInput from "./tags/inputs/BkInput";
//  BkUI.BkInput = BkInput;

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

  // Install the components
  Object.keys(BkUI).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      const Component = BkUI[key];
      Vue.component(Component.name, Component);
    }
  });
};

// Automatically install BkUI if Vue is available globally
/*
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(BkUI, window.BkUiConfig);
}
*/

export default BkUI;