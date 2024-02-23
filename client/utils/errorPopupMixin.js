import I18n from "../../lib/classes/i18n";
import { ValidationError } from "meteor/jagi:astronomy"

export default {
  methods: {
    showError(err,model) {
      if (!model) model = this.model
      model.setError(err);
      let error = model.getError('MeteorError')
      if (error) {
        error = I18n.t(error)
      } else {
        if (ValidationError.is(err))
          error = I18n.t("app.Meteor.Error.Validation error")
        else
          error = I18n.t("app.Meteor.Error.Unknown error")
      }
      this.$root.$bvToast.toast(error,{
        title: I18n.t("app.toast.title.failed"),
        variant: "danger",
        autoHideDelay: 5000
      })
      this.$emit("error",error,err)
    },
    showSuccess(key="app.toast.title.success") {
      // Toast launched from $root to avoid its destruction while leaving this page
      this.$root.$bvToast.toast(I18n.t("app.success"),{
        title: I18n.t(key),
        variant: "success",
        autoHideDelay: 5000
      })
    },
    errorCallback(err,result,model) {
      if (err) {
        this.showError(err,model)
      } else {
        this.showSuccess()
        this.$emit("success",result,model)
      }
    }
  }
}