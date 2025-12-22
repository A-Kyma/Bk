// for VueJS
import _startsWith from 'lodash/startsWith';
import configure from "./configure";

/*** Vue integration notes (Vue 3 + bootstrap-vue-3)
 * For Meteor + Vue 3 projects, install required NPM packages in the consuming app:
 *
 *   meteor npm install --save vue@^3 bootstrap bootstrap-vue-3 vue-meteor-tracker
 *
 * Example (in your consuming app's `imports/ui/main.js`):
 *
 *   import { createApp } from 'vue'
 *   import { BootstrapVue3 } from 'bootstrap-vue-3'
 *   import VueMeteorTracker from 'vue-meteor-tracker'
 *   import { BkUI } from 'meteor/akyma:bk'
 *   import 'bootstrap/dist/css/bootstrap.css'
 *   import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
 *
 *   const app = createApp(App)
 *   app.use(VueMeteorTracker)
 *   app.use(BootstrapVue3)
 *   app.use(BkUI)
 *   app.mount('#app')
 *
 * Notes:
 * - `BkUI` registers components for both Vue2 and Vue3 where possible; prefer using Vue 3 + `bootstrap-vue-3` for new projects.
 * - Keep `package.json` in this repo for dev scripts (Vite, tests) if you want, but it is not required for consuming this package in Meteor.
 */

/*
All tags has to be imported here and should begins with "Bk".

 */

import applyDrag from "../utils/applyDrag";
import BkActionableBadges from "./tags/inputs/BkActionableBadges.vue";
import BkBelongsToInput from "./tags/inputs/BkBelongsToInput.vue"
import BkBreadCrumb from "./tags/routes/BkBreadCrumb.vue"
import BkButtonIcon from "./tags/links/BkButtonIcon.vue"
import BkExportToXlsxButton from "./tags/links/BkExportToXlsxButton.vue";
import BkCardListClass from "./tags/forms/BkCardListClass.vue"
import BkDatalistInput from "./tags/inputs/BkDatalistInput.vue"
import BkBelongsToMany from "./tags/inputs/BkBelongsToMany.vue"
import BkDatePicker from "./tags/inputs/BkDatePicker.vue"
import BkDropdown from "./tags/inputs/BkDropdown.vue"
import BkFieldList from "./tags/forms/BkFieldList.vue";
import BkFile from "./tags/files/BkFile.vue"
import BkForm from "./tags/forms/BkForm.vue";
import BkInput from "./tags/inputs/BkInput.vue";
import BkInnerInput from "./tags/inputs/BkInnerInput.vue";
import BkLabel from "./tags/forms/BkLabel.vue";
import BkLanguage from "./tags/translation/BkLanguage.vue"
import BkLoading from "./tags/loading/BkLoading.vue"
import BkLogin from "./tags/forms/BkLogin.vue"
import BkModal from "./tags/modals/BkModal.vue";
import BkPage from "./tags/views/BkPage.vue";
import BkResetPassword from "./tags/forms/BkResetPassword.vue";
import BkChangePassword from "./tags/forms/BkChangePassword.vue"
import BkSubmit from "./tags/forms/BkSubmit.vue"
import BkSubscribe from "./tags/forms/BkSubscribe.vue";
import BkTable from "./tags/datatable/BkTable.vue"
import BkTextEditor from "./tags/inputs/BkTextEditor.vue";
import BkTranslate from "./tags/translation/BkTranslate.vue";
import BkTranslations from "./tags/views/BkTranslations.vue";
import LineChart from "./tags/charts/LineCharts.vue";
import PieChart from "./tags/charts/PieCharts.vue";
import BarChart from "./tags/charts/BarCharts.vue";
import PolarChart from "./tags/charts/PolarAreaCharts.vue";
import DoughnutChart from "./tags/charts/DoughnutCharts.vue";
import RadarChart from "./tags/charts/RadarCharts.vue";
import BkChart from "./tags/charts/BkChart.vue";
import BkView from "./tags/views/BkView.vue";
import BkViewInner from "./tags/views/BkViewInner.vue";
import BkViewClean from "./tags/views/BkViewClean.vue";
import BkPagination from "./tags/datatable/BkPagination.vue"
import errorPopupMixin from "../utils/errorPopupMixin";
import relationSubscriptionMixin from "../utils/relationSubscriptionMixin"

import { Container, Draggable } from "vue-smooth-dnd";

const BkUI = {
  applyDrag,
  Container,
  Draggable,
  BkActionableBadges,
  BkBelongsToInput,
  BkBelongsToMany,
  BkDatePicker,
  BkBreadCrumb,
  BkButtonIcon,
  BkExportToXlsxButton,
  BkCardListClass,
  BkDatalistInput,
  BkDropdown,
  BkFieldList,
  BkFile,
  BkForm,
  BkInput,
  BkInnerInput,
  BkLabel,
  BkLanguage,
  BkLoading,
  BkLogin,
  BkModal,
  BkPage,
  BkPagination,
  BkChangePassword,
  BkResetPassword,
  BkSubmit,
  BkSubscribe,
  BkTable,
  BkTextEditor,
  BkTranslate,
  BkTranslations,
  BkView,
  BkViewInner,
  BkViewClean,
  errorPopupMixin,
  relationSubscriptionMixin,
  LineChart,
  PieChart,
  BarChart,
  DoughnutChart,
  PolarChart,
  RadarChart,
  BkChart
}

BkUI.install = function (app, config = {}) {
  // Register helper that works for Vue2 constructor or Vue3 app instance
  const registerComponent = (Component) => {
    const Comp = (Component && Component.default) ? Component.default : Component;
    const name = Comp && Comp.name ? Comp.name : null;
    if (!name) return;

    // Vue 3 app instance and Vue 2 constructor both have a `component` method
    if (app && typeof app.component === 'function') {
      app.component(name, Comp);
      return;
    }

    // In some cases, install may be called without an app argument (fallback to global Vue)
    if (typeof window !== 'undefined' && window.Vue && typeof window.Vue.component === 'function') {
      window.Vue.component(name, Comp);
      return;
    }

    console.warn('BkUI: unable to register component', name);
  };

  // Configure components if configuration provided
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

  // Provide compatibility for components using $scopedSlots (Vue2 -> Vue3)
  if (app && typeof app.mixin === 'function') {
    app.mixin({
      computed: {
        $scopedSlots() { return this.$slots || {}; }
      }
    });
  } else if (typeof window !== 'undefined' && window.Vue && typeof window.Vue.mixin === 'function') {
    // Vue 2 global mixin fallback
    window.Vue.mixin({
      computed: {
        $scopedSlots() { return this.$scopedSlots || this.$slots || {}; }
      }
    });
  }

  // Install the components
  Object.keys(BkUI).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      const Component = BkUI[key];
      registerComponent(Component);
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