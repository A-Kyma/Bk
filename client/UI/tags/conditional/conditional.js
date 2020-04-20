import _ from 'lodash';

Template.registerHelper("hasRoute", function(model, page) {
  const path = model._type.toLowerCase() + page;
  const pathDep = FlowRouter._routesMap[path];
  if (!_.isUndefined(pathDep)) {
    const params = {id: model.id};
    return FlowRouter.path(pathDep.name, params);
  }
});

Template.registerHelper("global", v => (typeof Parameter !== 'undefined' && Parameter !== null ? Parameter.get(v) : undefined) || global[v]);

Template.registerHelper("contains", function(v1, v2) {
  if (_.isUndefined(v1)) {
    return false;
  } else {
    if (_.isArray(v1)) {
      if (_.contains(v1, v2)) {
        return true;
      } else {
        return false;
      }
    }
    if (!_.isArray(v1)) {
      if (v1.search(v2) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  }
});

Template.registerHelper("eq", function(v1, v2) {
  if (typeof v1 === "function") { v1 = v1(); }
  if (typeof v2 === "function") { v2 = v2(); }
  return v1 === v2;
});

Template.registerHelper("neq", function(v1, v2) {
  if (typeof v1 === "function") { v1 = v1(); }
  if (typeof v2 === "function") { v2 = v2(); }
  return v1 !== v2;
});

Template.registerHelper("first", function(v1) {
  if (v1.length !== 0) {
    if (v1[0].id === this.id) {
      return true;
    } else {
      return false;
    }
  }
});

Template.registerHelper("or", function() {
  let k = undefined;
  for (k in arguments) {
    if (!_.isUndefined(arguments[k])) { return true; }
  }
  return false;
});

Template.registerHelper("and", function() {
  let k = undefined;
  for (k in arguments) {
    if (_.isUndefined(arguments[k])) { return false; }
  }
  return true;
});

Template.registerHelper("notIn", function(v1, v2) {
  const arr = (v2 && v2.split(",")) || [];
  if (_.indexOf(arr, v1) === -1) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper("in", function(v1, v2) {
  let arr = undefined;
  if (_.isArray(v2)) {
    arr = v2;
  } else {
    arr = (v2 && v2.split(",")) || [];
  }
  return _.indexOf(arr, v1) !== -1;
});

Template.registerHelper("exist", function() {
  for (let o in arguments) {
    if (!o) { return false; }
  }
  return true;
});

Template.registerHelper("valueOfElementInArray", (array, element) => array[element]);

Template.registerHelper("isCurrentUser", user => user.id === Meteor.userId());

Template.registerHelper("canView", function(field) {
  return this.canView(field);
});

Template.registerHelper("canEdit", function(field) {
  return this.canEdit(field);
});

Template.registerHelper("canDelete", function(field) {
  return this.canDelete(field);
});

Template.registerHelper("canAccess", function(field) {
  if (!this) { return false; }
  if (!this.model) { return false; }
  let {
    model
  } = this;
  // Can manage other things than a model in @model context (can used in case of redefinition of the content of a modal)
  if (_.isArray(this.model)) { model = global[this.model._type] && global[this.model._type].new(); }
  if (typeof this.model === "string") { model = global[this.model] && global[this.model].new(); }
  if (!model) { return false; }
  if ((this.for === "view") || _.isArray(this.model)) {
    return model.canView(field);
  } else {
    return model.canEdit(field);
  }
});

Template.registerHelper("concat", (v1, v2) => _.extend(v1, v2.hash));

Template.registerHelper("extendContext",function(data) {
  result = {};
  result = _.extend(result,this,data.hash);
  return result;
})

Template.registerHelper("isCordova", () => Meteor.isCordova);