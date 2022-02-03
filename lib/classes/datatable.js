import _ from 'lodash';
import { Tracker } from 'meteor/tracker'
import { Class } from "meteor/jagi:astronomy";
import { Counts, publishCount } from "meteor/tmeasday:publish-counts";
import Filters from './filters.js';
import I18n from "./i18n";
import { EJSON } from 'meteor/ejson';
import Enum from "../modules/customFields/customs/Enum";
import { saveAs } from 'meteor/pfafman:filesaver';

//##########
// Allow creation of a datatable (rendered by tag table)
// Options for tag table (passed to this model):
// For what to render :
// - array: Array of models to render (Model.toArray({...}). This option used without subscription prevent any use of sort and filters for now
// or
// - subscription: name of the subscription used to render data
// - model: name of the model behind the subscription
// or
// - model : name of the model of which we already subscribed in router
//
// Some options for type "Subscription" and type "Model":
// - filter: default filter used for the subscription. Must be in format: filter='{"field": "value"}'
// - sort: default order used for the subscription. Must be in format: sort='{"field": 1}'
// - sortBy : field on which we want to sort
// - sortDesc : Boolean. True if desc, false if asc. Asc by default
// - initialFilter: Filter to show at data table loading
// - scroll: true if infinite scroll (no skip on server nor on client side)
// - multi: true if more than one table based on the same model on the same page (this implies no skip on server side and skip on client side)
// - full : true if you want to subscribe to all the collection (useful for download)
// - allPages : boolean to have as many page as there are documents. if value set to false => 5 pages only. default true
// if scroll and multi are not defined or false, datatable will skip on server side and not on client side (only if based on subscription)
// Max page is 5 if subscription and (scroll or multi)
//
// Other options:
// - customActions: template name where we can define an other action
// - fields: list of fields to render, comma separate
// - exportFields: list of fields that will be used when csv is created, comma separate
// - editableFields: fields that are inline editable
// - subscribeFields: add other fields in the subscription, can be set to "*" to select all fields available
// - modalFields: if defined, these fields will be used as "fields" for the fieldList in the modal called in view/edit
// - exclude: transfered to fieldList in modal. If defined, all fields will be taken except fields in exclude arguments
// - perPage: default 20. Number of records per page
// - actionType: if "btn" - show buttons instead of only icons
// Not yet used:
// - linkLabel: Boolean to show label, passed to clickToModal
// - deleteLabel: For deleteButton - key for I18n link label
//
// Server side, you can use Datatable.publish("subscriptionName",Collection) to publish the right thing
//#######################################################################################################################
class Datatable {
  static initClass() {
    this.prototype.subscription = undefined;
    this.prototype.handler = undefined;
    this.prototype.model = undefined;
    this.prototype.klass = undefined;
    this.prototype.array = [];
    this.prototype.filters = {};
    this.prototype.title = undefined;
    this.prototype.fields = [];
    this.prototype.perPage = 20;
    this.prototype.page = 1;
    this.prototype.maxPage = undefined;
    this.prototype.filterModel = undefined;
    this.prototype.defaultFilter = {};
    this.prototype.defaultSort = {};
    this.prototype.subdep = undefined;
    this.prototype.pagedep = undefined;
    this.prototype.sortdep = undefined;
    this.prototype.type = undefined;
    this.prototype.scroll = undefined;
    this.prototype.multi = undefined;
    this.prototype.firstReady = false;
    this.prototype.vueComponent = undefined;
    this.prototype.uid = undefined
  }

// Creation of a table object, with options from table tag
  constructor(vueComponent) {
    let f, fieldsArray, label, pref, options

    this.vueComponent = vueComponent
    if (vueComponent && vueComponent.$props) {
      options = vueComponent.$props
      this.uid = vueComponent._uid
    }
    else
      options = {}

    if (options == null) { options = {}; }
    const self = this;

    this.perPage = Number(options.perPage);
    if (_.isNaN(this.perPage) || (this.perPage < 0)) { this.perPage = 20; }
    this.filters = {};
    this.defaultFilter = {};
    this.defaultSort = options.sort || {};
    this.handler = undefined;
    this.page = options.page;
    if (_.isUndefined(this.page)) { this.page = 1; }
    this.multi = options.multi;
    this.scroll = options.scroll;
    this.full = options.full;
    this.allPages = options.allPages;
    if (_.isUndefined(this.allPages)) { this.allPages = true; }
    this.actions = options.actions;
    this.customActions = options.customActions;
    this.subscribeFields = options.subscribeFields;

    if (options.width) { this.width = options.width; }
    if (options.color) { this.color = options.color; }
    if (options.btColor) { this.btColor = options.btColor; }
    if (options.title) { this.title = I18n.t(options.title); }


    this.subdep = new Tracker.Dependency;
    this.pagedep = new Tracker.Dependency;
    this.sortdep = new Tracker.Dependency;
    this.filterdep = new Tracker.Dependency;

    if (typeof options.model === "string") {
      this.model = options.model;
      this.klass = Class.get(options.model);
    } else {
      this.klass = options.model;
      this.model = this.klass.getName();
    }

    if (options.array) {
      this.array = options.array;
      this.type = "array";
    }

    this.filterModel = this.klass && new this.klass();

    if (options.fields != null) {
      if (typeof options.fields === "string") {
        fieldsArray = options.fields.replace(RegExp(" ", "g"), "").split(",");
      } else {
        fieldsArray = options.fields;
      }
    } else {
      fieldsArray =  this.klass.getFieldsNames()
    }

    const fieldsEditable = (Array.isArray(options.editableFields)) ? options.editableFields : (options.editableFields && options.editableFields.replace(RegExp(" ", "g"),"").split(",")) || []
    this.fieldsEditable = fieldsEditable
    const subscribeFieldsArray = (options.subscribeFields && options.subscribeFields.replace(RegExp(" ","g"),"").split(",")) || [];
    const exportFieldsArray = (options.exportFields && options.exportFields.replace(RegExp(" ", "g"), "").split(",")) || [];

    const fieldsHash={};
    const fieldsSelected={};
    for (f of Array.from(fieldsArray)) {
//      if _.contains(f,".")
//        a = f.split(".")
//        label = a.pop() + ".label"
//        label = _.titleize(a.pop()) + "." + label
//      else
//        label = @model + "." + f + ".label"
      label = this.klass.getLabelKey(f);
      //if @klass._fields[f+"_id"] isnt undefined
      //  pref = @klass._fields[f+"_id"]
      //  fieldsHash[f]={field: f+'_id'}
      //  fieldsSelected[f+'_id']=1
      //else
      pref = this.klass.schema.fields[f];
      fieldsHash[f]={field: f};
      fieldsSelected[f]=1;
      fieldsHash[f].key = f;
      fieldsHash[f].label = label;
      fieldsHash[f].sortable = true;
      // Add also reference field for url
      if (pref && pref.url && pref.url.id && (pref.url.id !== "_id") && (pref.url.id !== "id")) {
        fieldsSelected[pref.url.id]=1;
      }
    }
    for (f of Array.from(fieldsEditable)) {
      if (fieldsHash[f]) { _.extend(fieldsHash[f],{"inlineEdit": 1}); }
    }

    for (f of Array.from(subscribeFieldsArray)) {
      fieldsSelected[f]=1;
    }

    const exportFieldsHash={};
    const exportFieldsSelected={};
    for (f of Array.from(exportFieldsArray)) {
//      if _.contains(f,".")
//        a = f.split(".")
//        label = a.pop() + ".label"
//        label = _.titleize(a.pop()) + "." + label
//      else
//        label = @model + "." + f + ".label"
      label = this.klass.getLabelKey(f);
      label = I18n.t(label,{defaultValue: label});
      pref = this.klass.schema.fields[f];
      exportFieldsHash[f]={field: f};
      exportFieldsHash[f].key = f;
      exportFieldsSelected[f]=1;
      exportFieldsHash[f].label = label;
      exportFieldsHash[f].sortable = true;
    }

    this.fields = _.values(fieldsHash);
    if (exportFieldsArray.length > 0) { this.exportFields = _.values(exportFieldsHash); }

    let filter = options.filter
    if (typeof filter !== "string") {
      filter = EJSON.stringify(filter);
    }

    if (options.sortBy) {
      self.setSort(options.sortBy,options.sortDesc);
    }

    /* Still needed ?
    for (let fieldPref of Array.from(this.fields)) {
      fieldPref.getSort = function() {
        self.sortdep.depend();
        return this.sort;
      };
      fieldPref.getFilter = function() {
        self.filterdep.depend();
        return this.filter;
      };
    }
    */

    if (_.isUndefined(options.array)) {
      if (filter !== undefined) {
        if (filter.indexOf('currentUser') !== -1) {
          filter = filter.replace('currentUser','\"'+Meteor.userId()+'\"');
        }
      }
      try {
        self.defaultFilter = EJSON.parse(filter) || {};
      } catch (error1) {}
    }


    if (!_.isUndefined(options.initialFilter)) {
      if (typeof options.initialFilter === "string") { options.initialFilter = EJSON.parse(options.initialFilter); }
      self.setFilter(options.initialFilter);
    }

    if (options.subscription) {
      self.subscription = options.subscription;
      this.type = "subscription";
      //As the field rendered from server depends on the fields chosen in the tag
      //we must also ask for the fields that are filtered/sorted on the server AND on the client
      //It's impossible to filter and sort if the fields attributes are not present on the client.
      if (self.defaultFilter) {
        _.map(self.defaultFilter, function(field, key) {
          //key = key.replace('_id','') if _.contains(key,'_id')
          const k = {};
          k[key] = 1;
          return _.extend(fieldsSelected,k);
        });
      }

      if (self.defaultSort) {
        _.map(self.defaultSort, function(field, key) {
          //key = key.replace('_id','') if _.contains(key,'_id')
          const k = {};
          k[key] = 1;
          return _.extend(fieldsSelected,k);
        });
      }
      const suboptions = {};
      if (!(options.subscribeFields = "*")) { suboptions.fields = fieldsSelected; }

//      subs = new SubsManager
//        cacheLimit: 100
//        expireIn: 5
      Tracker.autorun(function() {
        self.subdep.depend();
//         self.handler and self.handler.stop() #solve issue second page display first before refreshing
        suboptions.sort = self.defaultSort;
        if (self.multi || self.scroll) {
          suboptions.limit = self.perPage * self.page;
        } else {
          suboptions.limit = self.perPage;
          if (self.page > 0) { suboptions.skip = self.perPage * (self.page - 1); }
        }
        if (self.full) {
          delete suboptions.limit;
          delete suboptions.skip;
        }
        return self.handler=Meteor.subscribe(self.subscription,self.getSelector(),suboptions);
      });
    }
  }

  setPage(p) {
    if (!_.isNumber(p)) { return; }
    if (p < 1) { p = 1; }
    const m = this.getMaxPage();
    if (p > m) { p = m; }
    this.page = p;
    this.subdep.changed();
    this.pagedep.changed();
  }

  setPerPage(p) {
    const n = Number(p);
    if (_.isNaN(n)) { return; }
    this.perPage = n;
    this.page = 1;
    this.pagedep.changed();
    this.subdep.changed();
  }

  // Set new filter
  // options contains
  // - replace : if replace set, replace entire filter with new one
  setFilter(filter,options) {
    let f;
    if (filter == null) { filter = {}; }
    if (options == null) { options = {}; }
    if (_.isEmpty(filter) || options.replace) {
      this.filters = {};
      for (f of Array.from((this.fields))) {
        if (f.filter) {
          this.filterModel.set(f.field);
          delete f.filter;
        }
      }
    }

    for (f in (filter)) {
      let v = filter[f];
      const fieldPref = _.find(this.fields, function(e) { return e.field === f})
      if (v===null || v===undefined || v==="" || v==={}) {
        delete this.filters[f];
        if (fieldPref) { delete fieldPref.filter; }
        this.filterModel.set(f); //if options.replace
      } else {
        this.filters[f]=v;
        if (fieldPref) fieldPref.filter = v;
        if (v["$regex"]) { v = v["$regex"]; }
        this.filterModel.set(f,v); //if options.replace
      }
    }
    //this.full = false;
    this.subdep.changed();
    return this.filterdep.changed();
  }

  updateSort(field) {
    let sort = {}
    sort[field] = 1
    if (this.defaultSort[field] === 1){
      sort[field] = -1
    }

    this.defaultSort = sort;
    this.subdep.changed();
    this.sortdep.changed();
  }

  setSort(sortBy, sortDesc) {
    let sort;
    let desc;
    if (sortDesc) {
      desc = -1;
    } else {
      desc = 1;
    }
    const self = this;
    sort = {};
    sort[sortBy] = desc;
    this.defaultSort = sort;
    this.subdep.changed();
    this.sortdep.changed();
  }

  setContext(context={}) {
    // Conversion
    if (Match.test(context.sortDesc,String))
      context.sortDesc = (context.sortDesc === "true")
    if (Match.test(context.currentPage,String))
      context.currentPage = parseInt(context.currentPage)
    if (Match.test(context.perPage,String))
      context.perPage = parseInt(context.perPage)

    // Modification
    if (context.sortBy !== undefined || context.sortDesc !== undefined)
      this.setSort(context.sortBy,context.sortDesc)
    if (context.currentPage !== this.getPage())
      this.setPage(context.currentPage)
    if (context.perPage !== 0 && context.perPage !== this.perPage)
      this.setPerPage(context.perPage)
  }

  /*
  setSort(sort) {
    let f;
    const self = this;
    for (f of Array.from((this.fields))) {
      delete f.sort;
    }
    for (f in sort) {
      const v = sort[f];
      const fieldPref = _.findWhere(this.fields,{field: f});
      if (fieldPref) { fieldPref.sort = v; }
    }

    this.defaultSort = sort;
    this.subdep.changed();
    return this.sortdep.changed();
  }
  */

  stopSubscription() {
    if (this.handler) this.handler.stop()
  }

  getPage() {
    this.pagedep.depend();
    return this.page.valueOf();
  }

  getSelector() {
    const selector = _.clone(this.defaultFilter);
    _.extend(selector,this.filters);
    return selector;
  }

  getOptions(count) {
    const options = {};
    options.sort = this.defaultSort;
    if (_.isUndefined(count)) {
      options.limit = this.perPage;
      if (this.multi || (this.type !== "subscription") || this.full) {
        if (this.page > 0) { options.skip = this.perPage * (this.page - 1); }
      }
      if (this.scroll && (this.type === "subscription") && !this.full) {
        if (this.page > 0) { options.limit = this.perPage * this.page; }
      }
      if (this.full && this.perPage === 0 && this.type === "subscription") {
        options.limit = undefined
        options.skip = undefined
      }
    }
    return options;
  }

  getHeaders() {
    let headers = this.fields;
    // If only back or add, do not add column "actions"
    if (Array.isArray(this.customActions) && this.customActions.length > 0
      || (Array.isArray(this.actions)
        //&& this.actions.length > 0)
        && this.actions.filter(x=>!['add','back','export','import'].includes(x)).length > 0)
    ) {
      headers.push({key: "buttonActions", label: "datatable.buttonsActions"})
    }
    return headers;
  }

  getArray(options) {
//   Subscription based datatable
    let array;
    let self = this;
    if (options == null) { options = {}; }

    if (this.type === "subscription") {
      if (this.handler && (this.handler.ready() || (this.scroll && (this.page > 1)))) {
        if (this.full) { this.pagedep.depend(); }
        const selector = this.getSelector();
        options = this.getOptions();
        // When doing resubscription, we receive new ones before removing old ones. Then, we skip old ones.
        if  (!this.multi && !this.full && !this.scroll && !(this.page <= 1)) {
          const nbr = this.getCountLocal();
          if (nbr > this.perPage) {
            options.skip = this.perPage * (this.page -1);
          }
        }

        Tracker.autorun(() => {
            if (self.handler.ready()) {
              self.firstReady = true
              self.vueComponent.$nextTick(() => self.vueComponent.$emit("ready"))
            }
            array = self.klass.find(selector,options)
          }
        );

      } else {
        array = [];
      }

//   Array based datatable - TODO: Filters and Sort - /!\ Not working anymore
    } else if (this.type === "array") {
      this.pagedep.depend();
      this.sortdep.depend();
//     Implementation of Skip and Limit
      // array = _.first(this.array,this.page*this.perPage);
      // array = _.last(array,array.length - (this.perPage * (this.page - 1)));
      if (this.full)
        array = this.array.slice(0,this.array.length) // Create a copy of array, avoid infinite loop
      else
        array = this.array.slice((this.page - 1) * this.perPage, this.page * this.perPage)

      let options = this.getOptions()
      if (options && options.sort && Object.entries(options.sort).length > 0) {
        array.sort((a,b) => {
          for (let [sortField, sortOrder] of Object.entries(options.sort)) {
            let valueA = (Class.includes(a.constructor)) ? a.getValue(sortField) : a
            let valueB = (Class.includes(b.constructor)) ? b.getValue(sortField) : b
            if (valueA > valueB && sortOrder === 1 || valueA < valueB && sortOrder === -1)
              return 1
            if (valueA < valueB && sortOrder === 1 || valueA > valueB && sortOrder === -1)
              return -1
          }
          return 0
        })
      }
//   Model with full autopublish model or subscribed during route initialization
    } else {
      let suboptions;
      this.pagedep.depend();
      this.sortdep.depend();
      if (this.defaultSort) {
        suboptions = {};
        suboptions.sort = this.defaultSort;
      }
      let options = this.getOptions();
      options = {...options,...suboptions};
        // merge Datatable options and sorting
      array = self.klass.find(self.getSelector(),options)
    }
//   Do we expect all records we can see from pub/sub are viewable ?
    return array;
  }

  getFullArray(callback) {
    if (!callback) { return this.getArray({modelize: true}); }
    const self = this;
    if ((this.type === "subscription") && this.handler) {
      let autorun;
      return autorun = Tracker.autorun(function() {
        console.log("full:" + self.full);
        if (self.handler.ready() && self.full) {
          callback(self.klass.find(self.getSelector(),options));
          autorun.stop();
          return;
        }
        if (!self.full) {
          self.full = true;
          self.subdep.changed();
        }
      });
    } else if (this.type === "array") {
      return callback(this.array);
    } else {
      return callback(this.klass.find(this.getSelector()));
    }
  }

  getCount() {
    this.subdep.depend();
    if ((this.type === "subscription") && this.handler) {
      return Counts.get(this.subscription + '-count');
    } else if (this.type === "array") {
      return this.array.length;
    } else {
      return this.klass.find(this.getSelector(),this.getOptions(true)).count();
    }
  }

  getCountLocal() {
    return this.klass.find(this.getSelector(),this.getOptions(true)).count();
  }

  getWidth() {
    return this.width || 'col-lg-12 col-sm-12 col-xs-12';
  }

  getColor() {
    return this.color || 'blue2';
  }

  getColorBootstrap() {
    return this.btColor || 'primary';
  }

  getTitle() {
    const count=this.getCount();
    if (_.isUndefined(count)) {
      return I18n.t("app.loading");
    }
    return this.title || I18n.t(this.model + "._label", {count});
  }

  getExportTitle() {
    return I18n.t(this.model + ".export.label");
  }

  getFooterTitle() {
    const count=this.getCount();
    if (_.isUndefined(count)) {
      return I18n.t("app.loading");
    }
    return I18n.t(this.model + "._label", {count});
  }

  getAriaSort(field) {
    if (field === "buttonActions") return "none"
    if (this.defaultSort[field] === 1) return "ascending"
    if (this.defaultSort[field] === -1) return "descending"
    return "none"
  }

  getMaxPage() {
    this.pagedep.depend();
    if (this.getCountLocal() < this.perPage) {
      return 1;
    } else {
      let result;
      if ((this.type === "subscription") && this.handler) {
        result = Math.ceil(this.getCount() / this.perPage);
      } else {
        result = Math.ceil(this.getCount() / this.perPage);
      }
      if ((result > 5) && (this.type === "subscription") && (this.scroll || this.multi) && !this.full && !this.allPages) { return 5; }
      if (result < 1) { return 1; }
      return result;
    }
  }

  exportToCsv() {
    let df;
    const self = this;
    const exportFields = self.exportFields || self.fields;
    //set BOM to keep charset encoding in Excel
    let bb = '\uFEFF';
    //Headers
    for (df of Array.from(exportFields)) {
      bb = bb + '"' + I18n.t(df.label) + '";';
    }
    bb += "\n";
    //Rows
    return this.getFullArray(function(array) {
      for (let model of Array.from(array)) {
        for (df of Array.from(exportFields)) {
          let externalValue;
          const value = model.getValue(df.field, df.format);
          const fieldClass = model.getFieldClass(df.field)
          externalValue = value !== undefined ? value : "";
          if (df.type === "enumstring"){
            externalValue = I18n.t(value)
          }
          if (Enum.includes(fieldClass)){
            for (let [index,item] of value.entries()){
              if(index === 0){
                externalValue = I18n.t(item)
              }else{
                externalValue = externalValue + "," + I18n.t(item)
              }
            }
          }
          bb = bb + '"' + externalValue + '";';
        }
        bb += "\n";
      }
      //Generate Blob for downloading
      const blob = new Blob([bb],{"text/csv;charset=utf-8": "text/csv;charset=utf-8"});
      const date = new Date()
      const timestamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2)
      const csvName = I18n.t(self.getExportTitle()) + "_" + timestamp + ".csv"
      return saveAs(blob,csvName);
    });
  }
  importFromCsv(){
    console.log(this)
  }
}
Datatable.initClass();

if (Meteor.isServer) {
  /***
   * @function Datatable.publish
   * @description This method will allow to publish easily any collection in order to make it compatible with datatable.
   * Arguments are:
   * @param subscriptionName {String} - name of the subscription that will be used in tag datatable.
   * @param classOrCollection {Mongo.Collection|Class}- Mongo.collection or Classbehind this publication.
   * @param fields {object} - fields selection (mongodb style)
   * @param hasAccess {function|boolean} - if hasAccess, then userId not verified
   * @param restrictionFunction {function} - the clause added in the selector to avoid retrieve unauthorized collections
   *                 restriction has to be a function with one argument (userId)
   *                 in order to reevaluate the authorization at each republish
   *                 Should return the selector like {activity_id; {$in: [...]}}
   * @returns {Cursor} a cursor of published records in the collection
   * @requires meteor/tmeasday:publish-counts
   ***/
  Datatable.publish = (subscriptionName, classOrCollection, fields, hasAccess, restrictionFunction) =>
    Meteor.publish(subscriptionName, function (selector, options) {
      if (selector == null) {
        selector = {};
      }

      let collection = classOrCollection
      if (Class.includes(collection)) {
        collection = classOrCollection.getCollection()
      }

      if (typeof hasAccess === "function") {
        let isAccessible = hasAccess({selector, options, userId: this.userId})
        if (!isAccessible) return this.ready()
      } else {
        if (!hasAccess && !this.userId) return this.ready()
      }
      options.fields = fields || {}
      // Call restrictionFunction, setting this to {selector,options,userId}
      const restriction = (restrictionFunction && restrictionFunction({selector, options, userId: this.userId})) || {};
      if (restriction) {
        if (typeof restriction === "boolean" && !restriction) return this.ready()
        selector = {"$and": [restriction, selector]};
      }
      publishCount(this, subscriptionName + '-count', collection.find(selector, {fields: {_id: true}}), {noReady: true});
      return [collection.find(selector, options), Filters.find({
        creationUser: this.userId,
        subscription: subscriptionName
      }, {sort: {name: 1}})];
    });
}

export default Datatable;