import './modal.html';
import { ReactiveVar } from 'meteor/reactive-var';

Template.clickToModal.onCreated(() => Template.instance().viewPart = new ReactiveVar(undefined));

Template.clickToModal.helpers({
// To allow transfer of viewPart within context to _clickToModalInner
// So that, we can close the modal correctly
  modalView() {
    if (_.isUndefined(this.viewPart)) { this.viewPart = Template.instance().viewPart; }
    return this.viewPart.get();
  },

  getModalContext() {
    const context = _.clone(this);
    const {
      model
    } = this;
    if (this.for === "new") {
      if (typeof model === "string") {
        context.model = global[model] && global[model].new();
      } else {
        context.model = model.constructor.new(model.attributes);
      }
    } else {
      const id = Template.instance().viewPart.get() || this.model.id; // --> Not useful anymore since array now on collection and link maintained
      context.model = model.constructor.findInstance(id);
    }
    return context;
  },

// - actionType - used for datatable and lifecycle:
//   - btn implies class on link
//   - lib implies linkLabel and class on icon
//   - empty implies class on link or icon (same impact) and no linkLabel
// We use the same things analyzing class option
  class() {
    if ((this.actionType === "lib") || ((this.class != null ? this.class.search("lib") : undefined) !== -1) || ((this.class != null ? this.class.search("icon") : undefined) !== -1)) { return; }
    return this.class;
  },

  icon() {
    if (this.icon) { return this.icon; }
    if ((this.actionType === "lib") || ((this.class != null ? this.class.search("lib") : undefined) !== -1) || ((this.class != null ? this.class.search("icon") : undefined) !== -1)) { return this.class; }
  },

  linkLabel() {
    if ((this.actionType === "lib") ||  (!_.isUndefined(this.class) && (this.class.search("lib") !== -1))) { return true; }
    return this.linkLabel;
  }
});

Template.clickToModal.events({
  "click .toggleView"(event, template) {
    const toggle = template.viewPart;
    clearErrors();
    return toggle.set((toggle.get() ? undefined : this.model.id || true));
  }
});

Template._clickToModalInner.onCreated(function() {
  if (this.data.for !== "new") { this.modelId = this.data.model.id; }
});

Template._clickToModalInner.onRendered(function() {
  const self = this;
  $(this.find("#clickToModal")).modal('show').on("hidden.bs.modal", function(e){
    clearErrors();
    return e.target.$blaze_range.view._templateInstance.data.viewPart.set(false);
  });
});

Template._clickToModalInner.onDestroyed(function() {
  const self = this;
  if (!this.data.viewPart.get()) { return; }
  const dom = $(this.find("#clickToModal"));
  dom.removeClass('fade');
  dom.modal("hide");
});

Template._clickToModalInner.events({"click .close"(e) {
    $(".modal").modal("hide");
  }
});


Template.cancelModal.events({"click input"(e) {
    $(".modal").modal("hide");
  }
});