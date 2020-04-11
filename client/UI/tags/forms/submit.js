import './submit.html';

Template.registerHelper("submit", function() {
  this.label = this.label || this.for;
  return Template._submit;
});

Template._submit.helpers({
  label(action) {
    if (this.for === "transition") {
      return I18n.t(this.model._type + ".transition." + this.transition);
    } else {
      return I18n.t("submit." + action);
    }
  },

  submitClass() {
    if (this.for === "delete") {
      return "btn-danger delete";
    } else {
      return "btn-success";
    }
  },

  authClass() {
    if ((this.for === "new") && !this.model.canCreate()) {
      "hidden";
    }
    if ((this.for === "edit") && !this.model.canUpdate()) {
      "hidden";
    }
    if ((this.for === "delete") && !this.model.canDelete()) {
      return "hidden";
    }
  }
});

Template._submit.events({
  "click input"(event, template) {
    clearErrors();
    if ($(".input-conflict").length !== 0) {
      insertError("error.conflict",this.modal);
      return;
    }
    const options = {action: this.for};
    _.extend(options, this);
    delete options.model;

    BkClientCore.callModelAction(event, template, options);
  },
  "click .cancel"(event, template) {
    if (this.showCancel !== undefined) {
      if (this.cancelRoute !== undefined) {
        return FlowRouter.go(this.cancelRoute);
      } else {
        let capName;
        const oldRoute = __guard__(FlowRouter.current(), x => x.oldRoute);
        if (oldRoute != null ? oldRoute.name : undefined) {
          capName = oldRoute.name[0].toUpperCase() + oldRoute.name.slice(1);
        }
        if (oldRoute !== undefined) {
          if (_.isUndefined(Session.get("old"+capName+"Path"))) {
            return FlowRouter.go(oldRoute.path);
          } else {
            return FlowRouter.go(Session.get("old"+capName+"Path"));
          }
        } else {
          return FlowRouter.go('/');
        }
      }
    }
  }
});