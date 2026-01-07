// Server-side version of BkUI - NO client-only dependencies (vue-smooth-dnd, etc.)
// Used for SSR in emails/PDF generation
// All Vue components work, but no drag-drop or client interactions

import configure from "../client/UI/configure";
import _startsWith from 'lodash/startsWith';

// Import all Vue components (they render to HTML for SSR/PDF)
import BkActionableBadges from "../client/UI/tags/inputs/BkActionableBadges.vue.js";
import BkBelongsToInput from "../client/UI/tags/inputs/BkBelongsToInput.vue.js"
import BkBreadCrumb from "../client/UI/tags/routes/BkBreadCrumb.vue.js"
import BkButtonIcon from "../client/UI/tags/links/BkButtonIcon.vue.js"
import BkExportToXlsxButton from "../client/UI/tags/links/BkExportToXlsxButton.vue.js";
import BkCardListClass from "../client/UI/tags/forms/BkCardListClass.vue.js"
import BkDatalistInput from "../client/UI/tags/inputs/BkDatalistInput.vue.js"
import BkBelongsToMany from "../client/UI/tags/inputs/BkBelongsToMany.vue.js"
import BkDatePicker from "../client/UI/tags/inputs/BkDatePicker.vue.js"
import BkDropdown from "../client/UI/tags/inputs/BkDropdown.vue.js"
import BkFieldList from "../client/UI/tags/forms/BkFieldList.vue.js";
import BkFile from "../client/UI/tags/files/BkFile.vue.js"
import BkForm from "../client/UI/tags/forms/BkForm.vue.js";
import BkInput from "../client/UI/tags/inputs/BkInput.vue.js";
import BkInnerInput from "../client/UI/tags/inputs/BkInnerInput.vue.js";
import BkLabel from "../client/UI/tags/forms/BkLabel.vue.js";
import BkLanguage from "../client/UI/tags/translation/BkLanguage.vue.js"
import BkLoading from "../client/UI/tags/loading/BkLoading.vue.js"
import BkLogin from "../client/UI/tags/forms/BkLogin.vue.js"
import BkModal from "../client/UI/tags/modals/BkModal.vue.js";
import BkPage from "../client/UI/tags/views/BkPage.vue.js";
import BkResetPassword from "../client/UI/tags/forms/BkResetPassword.vue.js";
import BkChangePassword from "../client/UI/tags/forms/BkChangePassword.vue.js"
import BkSubmit from "../client/UI/tags/forms/BkSubmit.vue.js"
import BkSubscribe from "../client/UI/tags/forms/BkSubscribe.vue.js";
import BkTable from "../client/UI/tags/datatable/BkTable.vue.js"
const BkTextEditor = null; // Not available server-side (requires @tiptap)
import BkTranslate from "../client/UI/tags/translation/BkTranslate.vue.js";
import BkTranslations from "../client/UI/tags/views/BkTranslations.vue.js";
import LineChart from "../client/UI/tags/charts/LineCharts.vue.js";
import PieChart from "../client/UI/tags/charts/PieCharts.vue.js";
import BarChart from "../client/UI/tags/charts/BarCharts.vue.js";
import PolarChart from "../client/UI/tags/charts/PolarAreaCharts.vue.js";
import DoughnutChart from "../client/UI/tags/charts/DoughnutCharts.vue.js";
import RadarChart from "../client/UI/tags/charts/RadarCharts.vue.js";
import BkChart from "../client/UI/tags/charts/BkChart.vue.js";
import BkView from "../client/UI/tags/views/BkView.vue.js";
import BkViewInner from "../client/UI/tags/views/BkViewInner.vue.js";
import BkViewClean from "../client/UI/tags/views/BkViewClean.vue.js";
import BkPagination from "../client/UI/tags/datatable/BkPagination.vue.js"
import errorPopupMixin from "../client/utils/errorPopupMixin";
import relationSubscriptionMixin from "../client/utils/relationSubscriptionMixin"

// NOTE: No vue-smooth-dnd (Container, Draggable) - not needed for SSR
// NOTE: No applyDrag - client-only utility

const BkUI = {
  // No Container, Draggable, applyDrag (client-only for drag & drop)
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

// Simple install for SSR context (no client interactions)
BkUI.install = function (app, config = {}) {
  const registerComponent = (Component) => {
    const Comp = (Component && Component.default) ? Component.default : Component;
    const name = Comp && Comp.name ? Comp.name : null;
    if (!name) return;

    if (app && typeof app.component === 'function') {
      app.component(name, Comp);
    }
  };

  // Configure components if configuration provided
  Object.keys(config).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      if (BkUI[key] === undefined) return;
      const Component = BkUI[key];
      const props = config[key];
      configure(Component, props);
    }
  });

  // Install the components
  Object.keys(BkUI).forEach(key => {
    if (_startsWith(key, 'Bk')) {
      const Component = BkUI[key];
      registerComponent(Component);
    }
  });
};

export default BkUI;
