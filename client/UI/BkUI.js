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

 See also https://github.com/meteor-vue/guide
***/

/*
All tags has to be imported here and should begins with "Bk".

 */

import BkBelongstoInput from "./tags/inputs/BkBelongsToInput"
import BkBreadCrumb from "./tags/routes/BkBreadCrumb"
import BkButtonIcon from "./tags/links/BkButtonIcon"
import BkCardListClass from "./tags/forms/BkCardListClass"
import BkDatalistInput from "./tags/inputs/BkDatalistInput"
import BkBelongsToMany from "./tags/inputs/BkBelongsToMany"
import BkDatePicker from "./tags/inputs/BkDatePicker"
import BkDropdown from "./tags/inputs/BkDropdown"
import BkFieldList from "./tags/forms/BkFieldList";
import BkFile from "./tags/files/BkFile"
import BkForm from "./tags/forms/BkForm";
import BkInput from "./tags/inputs/BkInput";
import BkInnerInput from "./tags/inputs/BkInnerInput";
import BkLabel from "./tags/forms/BkLabel";
import BkLanguage from "./tags/translation/BkLanguage"
import BkLoading from "./tags/loading/BkLoading"
import BkLogin from "./tags/forms/BkLogin"
import BkModal from "./tags/modals/BkModal";
import BkResetPassword from "./tags/forms/BkResetPassword";
import BkChangePassword from "./tags/forms/BkChangePassword"
import BkSubmit from "./tags/forms/BkSubmit"
import BkSubscribe from "./tags/forms/BkSubscribe";
import BkTable from "./tags/datatable/BkTable"
import BkTranslate from "./tags/translation/BkTranslate"
import BkView from "./tags/views/BkView";
import BkViewInner from "./tags/views/BkViewInner";
import BkViewClean from "./tags/views/BkViewClean";
import BkPagination from "./tags/datatable/BkPagination"
import errorPopupMixin from "../utils/errorPopupMixin";
import relationSubscriptionMixin from "../utils/relationSubscriptionMixin"

const BkUI = {
  BkBelongstoInput,
  BkBelongsToMany,
  BkDatePicker,
  BkBreadCrumb,
  BkButtonIcon,
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
  BkPagination,
  BkChangePassword,
  BkResetPassword,
  BkSubmit,
  BkSubscribe,
  BkTable,
  BkTranslate,
  BkView,
  BkViewInner,
  BkViewClean,
  errorPopupMixin,
  relationSubscriptionMixin
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