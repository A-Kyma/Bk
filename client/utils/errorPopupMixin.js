import I18n from "../../lib/classes/i18n";

export default {
  methods: {
    showError(err) {
      this.model.setError(err);
      this.$root.$bvToast.toast(I18n.t("app.error"),{
        title: I18n.t("app.toast.title.failed"),
        variant: "danger",
        autoHideDelay: 5000
      })
    },
    showSuccess(key="app.toast.title.success") {
      // Toast launched from $root to avoid its destruction while leaving this page
      this.$root.$bvToast.toast(I18n.t("app.success"),{
        title: I18n.t(key),
        variant: "success",
        autoHideDelay: 5000
      })
      this.dismissCountDown = this.dismissSecs;
    },
    errorCallback(err,result) {
      if (err) {
        this.showError(err)
      } else {
        this.showSuccess()
      }
    }
  }
}