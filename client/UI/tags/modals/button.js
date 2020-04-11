import './button.html';

Template.button.helpers({
  canDoAction() {
    if (_.isUndefined(this.model) || _.isUndefined(this.for)) {
      return false;
    } else {
      if (this.for === 'delete') {
        if (this.model.canDelete()) {
          return true;
        } else {
          return false;
        }
      } else {
        if (_.isUndefined(this.route)) {
          return false;
        } else {
          switch (this.for) {
            case "view":
              if (this.model.canView()) { return true; }
              break;
            case "edit":
              if (this.model.canUpdate()) { return true; }
              break;
            case "new":
              if (this.model.canCreate()) { return true; }
              break;
            default:
              return false;
          }
        }
      }
    }
  },
  view() {
    if (this.for === 'view') { return true; }
  },
  edit() {
    if (this.for === 'edit') { return true; }
  },
  delete() {
    if (this.for === 'delete') { return true; }
  },
  new() {
    if (this.for === 'new') { return true; }
  },
  class() {
    return this.class;
  }
});

Template.button.events({
  "click .clickToActionButton"(event, template){
    const params = {};
    params.action = template.data['for'];
    params.model = template.data.model;
    params.route = template.data.route;
    params.routeQuery = template.data.routeQuery;
    if ((params.route !== undefined) && (params.action !== 'delete')) {
      if (params.routeQuery !== undefined) {
        FlowRouter.go(params.route.replace('_id',params.model.id) + "?" + params.routeQuery);
      } else {
        FlowRouter.go(params.route.replace('_id',params.model.id));
      }
    }
    if (params.action === 'delete') {
      const result = confirm("Are sure you want to delete?");
      if (result) {
        if (params.route !== undefined) {
          return params.model.destroy({redirect_to: params.route});
        } else {
          return params.model.destroy();
        }
      }
    }
  }
});