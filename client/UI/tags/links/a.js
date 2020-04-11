import './a.html';

// Create a link
Template.a.helpers({
  value() {
    let pathName;
    let {
      path
    } = this;

    // Allow dynamic path when not knowing Model Type
    if (this.type && (typeof (this.type) === "string")) { pathName = this.type.toLowerCase() + path; }
    const pathDep = FlowRouter._routesMap[pathName];
    if (!_.isUndefined(pathDep)) {
      const params = {id: this.id};
      path = FlowRouter.path(pathDep.name,params);
    }
    return path;
  }
});