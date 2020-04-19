import './views.html';
import { Class } from 'meteor/jagi:astronomy';
import { _ } from 'lodash';
import { Bk } from '../../../client';


/*
View tag: give the value of the field, with label (if needed)
Mandatory arguments:
- model is the instanciated model for which we want to view a field
- field is the field we want to view (full path like department.company.name is allowed)
Optional arguments
- label is passed to tag label and should be a key to be found in local file
- noLabel implies tag label is not called
- labelClass force a certain class for tag label
- noDiv implies tag view won't be in a div
- noHtml implies tag provide only the field's value => tag noHtml
- type : make possible to force a type for a field e.g. {{> view model=. field="creationDate" type="Time"}}
- size : is the image size used. Default is ... "default"
- count: this argument can be passed to show the number of occurence in a belongs_to_many field
- inlineEdit to allow inline edition (click to edit)
- checkEmpty: used with inlineEdit. When field is empty, value is replaced by translation of app.undefined.
Computed arguments
- _editable which is inlined-editable if inlineEdit argument passed
- _row which is a div class. Value is "input-editable" if inlineEdit argument passed, else "row"
- _pref is the current field preference. (found in class._fields).
TODO => Take into account any "tree" field like department.company.name or user.profile.name
- _type is the type of the field (passed by class._fields preferences)
- _url transform the view into a link (passed by pref)
*/
Template.registerHelper('view', function() {
  this.model = Class.getModel(this.model);

  if (this.model && this.field) {
//    if @field.indexOf(".") > 0
//      field = @field.substring(0,@field.indexOf("."))
//    else
//      field = @field
    let pref = this.model.getDefinition(this.field);

    if (pref) {
      if (!this.model.canView(this.field)) { return null; }
      //   Add new values in the context
      if (pref.type === "array") {
        this.fieldType = "array";
        pref = pref[0];
        if (_.isString(pref.type) && (pref.embedded === undefined) && (pref.type !== "hash")) {
          this.fieldSubType = "strings";
        }
        if (_.isString(pref.type) && (pref.embedded === undefined) && (pref.type === "hash")) {
          this.fieldSubType = "hash";
        }
        if (_.isObject(pref.type) || (_.isString(pref.type) && (pref.embedded !== undefined))) {
          this.fieldSubType = "model";
        }
      } else {
        this.fieldType = pref.type;
      }
      if (this.inlineEdit) { this._editable = "inline-editable"; }
      if (this.noHtml) { return Template["noHtml"]; } else { return Template["_view"]; }
    } else {
      this.field = field;
      this.tag = "view";
      this.type = this.model._type;
      return Template["_tagFieldError"];
    }
  } else {
    this.tag = "view";
    return Template["_tagMissing"];
  }
});

Template._view.helpers({
  _row() {
    if (this.inlineEdit) { return "input-editable"; } else { return "row"; }
  }
});

Template._viewCleanUrl.helpers({
  _url() {
    let params, pathDep, pref, route;
    if (this._pref != null) {
      pref = this._pref;
    } else {
      pref = (this._pref = this.model.getDefinition(this.field));
    }
    if (!pref) { return; }
    if (pref.type === "belongs_to") {
      route = pref.relation || (pref.class && pref.class.toLowerCase()) || this.field;
      route += "Page";
      pathDep = FlowRouter._routesMap[route];
      if (!_.isUndefined(pathDep)) {
        params = {id: this.model.get(this.field)};
        return FlowRouter.path(pathDep, params);
      }
    }
    const {
      url
    } = pref;
    if (!url) { return; }
    ({
      route
    } = url);
    pathDep = FlowRouter._routesMap[route];
    if (!_.isUndefined(pathDep)) {
      params = {id: url.id ? this.model.attributes[url.id] || this.model[url.id] : this.model.id};
      return FlowRouter.path(pathDep.name, params);
    }
  }
});

Template.registerHelper('_viewType', function() {
  let pref, templateName;
  if (this._pref != null) {
    pref = this._pref;
  } else {
    pref = (this._pref = this.model.getDefinition(this.field));
  }
  let type = pref.type.name;
  if (_.includes(['color', 'editor', 'markdown', 'wysiwyg', 'image', 'lifecycle', 'boolean'],type)) {
    templateName = "_view" + Bk.capitalize(type);
  } else if (_.includes(['enumstring', 'i18n'],type)) {
    templateName = "_viewI18n";
  } else if (type === "enumstring_many") {
    templateName = "_viewEnumstringMany";
  } else if (type === "belongs_to_many") {
    templateName = "_viewBelongsToMany";
  } else if (type === "files") {
    templateName = "_viewFiles";
  } else if (type === "hash") {
    templateName = "_viewHash";
  } else if (type === "array") {
    templateName = "_viewArray";
  } else {
    templateName = "_viewDefault";
  }
  return Template[templateName] || null;
});


Template.registerHelper('markdownToHTML', function(value,options) {
  if (_.isUndefined(value)) { return ""; }
  return markdown.toHTML(value);
});

Template.registerHelper('getViewValue', function() {
  if (!this.model || !this.field || !this._pref) { return; }
  return Bk.getValueForField(this,"view");
});