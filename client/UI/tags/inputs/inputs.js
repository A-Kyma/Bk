import './inputs.html';
import { Class } from 'meteor/jagi:astronomy';
import _ from 'lodash';
import Bk from "../../../utils/BkClientCore";
/*
Input tag: give the value of the field, with label (if needed)
Mandatory arguments:
- model is the instanciated model for which we want to view a field
- field is the field we want to view (full path like department.company.name is allowed)
Optional arguments
- label is passed to tag label
- fieldToShow (only for relations like belongs_to): specified field to use if not default name
- selector (only for relations like belongs_to): apply optional selector to relationsAll (i.e. companyAll) (more for has_many)
- allowBlank : if we authorize not to choose any value from belongs_to
- noLabel implies tag label is not called
- noConflict implies no conflict will be managed for this field
- value : force value of input tag.
- noDiv implies tag view won't be in a div
- noHint implies no hint is shown in the input tag. Hint can be found with key model.field.hint
- noJq implies no jQuery used for combobox (belongs_to)
- noValidation implies no validation done when blur input / select / editor
- size : image size. Used when input degrades to view
- inlineEdit to allow inline edition (click to edit)
- class is the class added to the input / select / editor tag
- iconClass : little icon class that appears just before the input
- beforeIconClass : little icon prepended to the input
- afterIconClass : little icon appended to the input

Preference arguments (found in class._fields or lifecycle definition)
- min : minimum value for a number
- max : maximum value for a number
- step : step used to increase or decrease a number using minus or plus graphic
- class : this one is found in lifecycle definition and overrides any class argument passed
Computed arguments
- _editable which is inlined-editable if inlineEdit argument passed
- _row which is a div class. Value is "input-editable" if inlineEdit argument passed, else "row"
- _availableValues (for lifecycle, enumstring, belongs_to and color tags)
- hint to give the hint internationalized
- placeholder to give the placeholder internationalized
- _pref is the current field preference. (found in class._fields).
TODO => Take into account any "tree" field like department.company.name or user.profile.name
- _url transform the view into a link (passed by pref)
*/
Template.registerHelper('input', function() {
  this.model = Class.getModel(this.model);

  if (!this.model || !this.field) {
    this.tag = "input";
    return Template["_tagMissing"];
  }

  this.modelName = this.model.constructor.getName();

  let pref = this._pref = this.model.getDefinition(this.field);

  if (!pref) {
    this.tag = "view"
    this.type = this.model.constructor.name;
    return Template["_tagFieldError"];
  }

  let type = this._type = pref.type.name;

  if (!this.model.canView(this.field)) { return null; }

  if (!this.model.canEdit(this.field)) {
    this.for = "view";
    return Template["view"];
  }

  if (this.inlineEdit && this.model.canEdit(this.field)) { this._editable = "inline-editable"; }

  let definitionClass = pref.constructor.name;
  this.value = this.model.get(this.field);
  let templateName;

  /*
      //If type belongs_to and only one argument, we show the view tag and force the value
      if ((this._pref.type === "belongs_to") && this._pref.mandatory) {
        let relations = this.model.relations[this.field+'All']();
        if (this._pref.allowedValues) {
          const allowedValues = this._pref.allowedValues(this.model.attributes);
          relations = _.filter(relations, m => Array.from(allowedValues).includes(m.id));
        }
        if (_.isArray(relations) && (relations.length === 1)) {
          this.model.set(this.field,relations[0].id);
          return Template["_view"];
        }
      }
  */
  if (this.model.canEdit(this.field)) { return Template["_input"]; } else { return Template["_view"]; }

});
Template._beforeInput.helpers({
  _beforeAddonIcon() {
    if (this._pref.beforeAddon) {
      const value = this._pref.beforeAddon;
      if (value.indexOf("glyphicon") > -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  _beforeAddonTranslate() {
    if (this._pref.beforeAddon) {
      if (this._pref.beforeAddon.indexOf('.') > -1) {
        return true;
      }
    } else {
      return false;
    }
  }
});

Template._afterInput.helpers({
  isMaterial() {
    if ($.material) { return true; }
  },
  _afterAddonTranslate() {
    if (this._pref.afterAddon) {
      if (this._pref.afterAddon.indexOf('.') > -1) {
        return I18n.t(this._pref.afterAddon);
      }
    } else {
      return this._pref.afterAddon;
    }
  }
});

Template._afterInput.events({
  "click .oneClickAction"(event, template) {
    template.data.model.save();
    return $(event.delegateTarget).find('input')[0].value = "";
  }
});


Template._afterInputGroup.helpers({
  _errorClass() {
    if (!_.isEmpty(this.model.getError(this.field)) && !this._pref.afterAddon) {
      return "remove";
    } else {
      return undefined;
    }
  },
  _validatedClass() {
    if (!this._pref.noValidClass && !this._pref.afterAddon) {
      if (_.isEmpty(this.model.getError(this.field))) {
        return "ok";
      } else {
        return undefined;
      }
    }
  }
});

Template.registerHelper('inputFilter', function() {
  if (typeof this.model === "string") { this.model = global[this.model] && global[this.model].new(); }
  if (this.model && this.model._type && this.field) {
    this.filter = 1;
    this.noLabel = 1;
    this.noDiv = 1;
    this.size = "small";
    this.allowBlank = 1;
    this.noHint = 1;
    this.noValidation = 1;
    this.noJq = 1;
    this._pref = this.model.getPreferenceForField(this.field);
    //@_pref = BkCore.getFilterPreferenceFields(@model,@field)
    return Template._inputFilter;
  } else {
    this.tag = "inputFilter";
    return Template["_tagMissing"];
  }
});

Template._input.helpers({
  _row() {
    if (this.inlineEdit) { return "input-editable"; } else { return "row"; }
  },
  _tagResize() {
    if (this.labelSize) {
      let numb;
      let number = this.labelSize.match(/\d/g);
      number = (numb = number.join(""));
      number = 12 - number;
      return number;
    }
  },
  _tagScreen() {
    if (this.labelSize) {
      const screen = this.labelSize.substring(0,6);
      return screen;
    }
  },
  _hasFeedback() {
    if (this._pref.afterIconClass) {
      return "has-feedback";
    }
  },
  validatedClass() {
    if (this._pref.noValidClass) {
      return "";
    } else {
      if (_.isEmpty(this.model.getError(this.field))) {
        return "has-success";
      } else {
        return "";
      }
    }
  }
});
Template._input.onRendered(function() {
  if ($.material) {
    $.material.init();
    $.material.checkbox();
    return $.material.radio();
  }
});

Template.registerHelper('getInputValue', function() {
  if (this.value && this.value["$regex"]) { return this.value["$regex"]; }
  if (!this.model || !this.field || !this._pref) { return; }
  return Bk.getValueForField(this,"input");
});

Template._inputBelongs_to.helpers({
  _generateReference() {
    if (this.generateReference) {
      return "generateReference";
    } else {
      return "";
    }
  }
});

Template.registerHelper('_inputType', function() {
  let templateName;
  let pref = this._pref = this.model.getDefinition(this.field);
  let type = this._type = pref.type.name;

  //TODO
  if (pref.type && pref.type._fields) {
    templateName = "_inputBelongs_to";
    if (pref.autocomplete) { templateName = "_inputAutoCompleteBelongs_to"; }
    if (pref.radio) { templateName = "_inputBelongs_toRadio"; }
  } else {
    templateName = "_input" + Bk.capitalize(type);
  }
  return Template[templateName] || null;
});

Template._innerInputType.helpers({
  conflict() {
    this._pref = this._pref || BkCore.getPreferenceFields(this.model,this.field);
    if (this.noConflict || _.isUndefined(this._pref) || ["file","belongs_to_many","has_many","embedded","hash"].includes(this._pref.type)) { return false; }
    const instance = Template.instance();
    if (this.model.isPersisted() && instance.view.isRendered) {
      let toSelectValue;
      const {
        userValue
      } = instance;
      const {
        oldValue
      } = instance;
      const conflictValue = this.model.get(this.field,true);
      if (_.isEqual(conflictValue,userValue)) { return false; }
      if (_.isEqual(conflictValue,oldValue) && _.isUndefined(userValue)) { return false; }
      if (_.isEqual(conflictValue,oldValue) && !_.isUndefined(userValue)) {
        this.model.set(this.field,userValue);
        return false;
      }
      if (_.isUndefined(userValue)) {
        toSelectValue = oldValue;
      } else {
        toSelectValue = userValue;
      }
      return {
        oldValue: toSelectValue,
        conflictValue
      };
    }
    return false;
  },
  _beforeAfterInput() {
    const parentPref = this.model.getDefinition(this.field);
    if (this._pref.beforeAddon || this._pref.afterAddon || this._pref.afterButtonAddon || this.inlineEdit || parentPref.constructor.name === 'ListField') {
      return true;
    } else {
      return false;
    }
  }
});
Template._inputConflict.events({
  'click a.yes'(event, template) {
    clearErrors();
    const context = Template.parentData(1);
    const innerInputTypeInstance = Blaze.getView(Blaze.getView(),"Template._innerInputType")._templateInstance;
    return context.model.set(context.field,this.oldValue);
  },
  'click a.no'(event, template) {
    clearErrors();
    const context = Template.parentData(1);
    const innerInputTypeInstance = Blaze.getView(Blaze.getView(),"Template._innerInputType")._templateInstance;
    // We remove userValue and set conflictValue as the old one
    delete innerInputTypeInstance.userValue;
    innerInputTypeInstance.oldValue = this.conflictValue;
    // Since value has already been updated to conflictValue, we only have to force dependency update
    return context.model._fieldDeps[context.field] && context.model._fieldDeps[context.field].changed();
  }
});

Template._innerInputType.events({
  'click input[type="radio"],input[type="checkbox"]'(event, template) {
    if (!_.isArray(template.data.model.constructor._fields[template.data.field])) {
      return Bk.callFieldValidation(event,template);
    }
  },
  'blur select,textarea,input[type="text"],input[type="password"],input[type="number"],input[type="email"],input[type="url"],input[type="search"],input[type="tel"]'(event, template) {
    const pref = this._pref || template.data.model.constructor.getDefinition(template.data.field);
    let makeValidation = true;
    if (_.isArray(pref)) {
      makeValidation = false;
    }
    if (_.isObject(pref)) {
      if (_.isFunction(pref.type) && pref.autocomplete) {
        makeValidation = false;
      }
    }
    if (makeValidation) {
      return Bk.callFieldValidation(event,template);
    }
  },
  'change input[type="date"],input[type="week"],input[type="month"], input[type="color"]'(event, template) {
    if (!_.isArray(template.data.model.constructor._fields[template.data.field])) {
      return Bk.callFieldValidation(event,template);
    }
  },
  'click .addToArray'(event, template) {
    if (this._pref.type === "array") {
      return Bk.callFieldValidation($(event.currentTarget).parent().prev('input').get(0),template);
    }
  },
//  Tag _input_ArrayStrings_actions
  'click .removeFromArray'(event, template) {
    return template.data.model.set(template.data.field+"["+event.currentTarget.attributes.data.value+"]", null);
  }
});

Template._inputFilter.events({
  'change select,input,textarea'(event, template) {
    return Bk.callFieldValidation(event,template);
  }
});

Template._inputText.helpers({
  _inputSize() {
    if (this.inputSize) {
      if (this.inputSize === "large") {
        return "input-lg";
      }
      if (this.inputSize === "small") {
        return "input-sm";
      }
    }
  }
});

Template._inputNumber.events({
  'keypress input'(event,template) {
    if ((event.which > 57) || ((event.which < 48) && (_.indexOf([0, 8,44],event.which) === -1))) {
      return event.preventDefault();
    }
  }
});

Template._inputPhone.events({
  'keypress input'(event,template) {
    if ((event.which > 57) || ((event.which < 48) && (_.indexOf([43,40,41,45,46],event.which) === -1))) {
      return event.preventDefault();
    }
  }
});

Template._inputBoolean.helpers({
  _mainClass() {
    if (this.mainClass) {
      return this.mainClass;
    } else {
      if (!this.inline) {
        return "col-sm-12";
      }
    }
  },
  _inline() {
    if (this.inline) {
      return 'checkbox-inline';
    }
  }
});

Template._inputDate.helpers({
  _datePicker() {
    if (!Bk._device.isMobile()) {
      return 'date-picker';
    }
  }
});

// http://eternicode.github.io/bootstrap-datepicker/?markup=input&format=&weekStart=&startDate=&endDate=&startView=0&minViewMode=0&todayBtn=false&language=fr&orientation=auto&autoclose=on&keyboardNavigation=on&forceParse=on#sandbox
Template._inputDate.onRendered(function() {
  let self;
  return self = this.data;
});
// ONLY FOR NON MOBILE DEVICES
//  $(this.find(".date-picker")).datepicker(
//    todayBtn: true
//    language: I18n.get_locale()
//    autoclose: true
//    todayHighlight: true
//    format: 'yyyy-mm-dd'
//    startView: 'decade'
//  )

Template._inputDatetime.helpers({
  _dateTimePicker() {
    if (!Bk._device.isMobile()) {
      return 'datetime-picker';
    }
  }
});

Template._inputDatetime.events({
  'blur input'(event, template) {
    const self = template.data;
    if (Bk._device.isMobile()) {
      const d = moment(event.target.value);
      if (_.isDate(d._d)) {
        self.model.set(self.field,d._d);
      } else {
        self.model.set(self.field,undefined);
      }
      if (self.model.isValid(self.field)) {
        // datetime-local is not supported by all browsers.
        // If not supported it will change the type from datetime-local to text input
        // The data will be saved as date format stored in date._d. We only need to show the date correctly.
        const datetimeLocalString = d._i;
        const textString = moment(event.target.value).format('YYYY-MM-DD HH:mm');
        if (event.target.type === "text") {
          return event.target.value = textString;
        } else {
          return event.target.value = datetimeLocalString;
        }
      } else {
        return event.target.value = "";
      }
    }
  }
});

Template._inputDatetime.onRendered(function() {
  const self = this.data;
  // ONLY FOR NON MOBILE DEVICES
  return $(this.find(".datetime-picker")).datetimepicker({
    locale: Session.get("current_language"),
    viewMode: 'years',
    format: 'YYYY-MM-DD[T]HH:mm'
  }).on("dp.change", function(e) {
    if (_.isDate(e.date._d)) {
      self.model.set(self.field,e.date._d);
    } else {
      self.model.set(self.field,undefined);
    }
    if (self.model.isValid(self.field)) {
      // datetime-local is not supported by all browsers.
      // If not supported it will change the type from datetime-local to text input
      // The data will be saved as date format stored in date._d. We only need to show the date correctly.
      const d=e.date._d;
      const datetimeLocalString = moment(d).format('YYYY-MM-DD[T]HH:mm');
      const textString = moment(d).format('YYYY-MM-DD HH:mm');
      if (e.target.type === "text") {
        return e.target.value = textString;
      } else {
        return e.target.value = datetimeLocalString;
      }
    } else {
      return e.target.value = "";
    }
  });
});

Template._inputTime.helpers({
  _clockPicker() {
    if (!Bk._device.isMobile()) {
      return 'clock-picker';
    }
  }
});

Template._inputTime.events({
  'blur input'(event, template) {
    const self = template.data;
    const {
      value
    } = event.target;
    if (Bk._device.isMobile()) {
      self.model.set(self.field, value);
      return self.model.isValid(self.field);
    }
  }
});

Template._inputTime.onRendered(function() {
  const self = this.data;
  // ONLY FOR NON MOBILE DEVICES
  return $(this.find(".clock-picker")).clockpicker({
    autoclose: true
  }).change(function(e){
    e.target.value = this.value;
    self.model.set(self.field,this.value);
    return self.model.isValid(self.field);
  });
});

Template._inputWysiwyg.onRendered(function() {
  if (!this.data) { return; }
  const self = this.data;
  const dom = $(this.find(".wysiwyg-editor"));
  return dom.summernote().on("summernote.blur", function(e, contents) {
    if (contents.target.innerHTML === "<p><br></p>") {
      self.model.set(self.field,"");
    } else {
      self.model.set(self.field, contents.target.innerHTML);
    }
    return self.model.isValid(self.field);
  });
});

Template._inputEditor.onRendered(function() {
  const self = this.data;
  return this.$(".markdown-editor").markdown({
    onBlur(e) {
      self.model.set(self.field,e.getContent());
      return self.model.isValid(self.field);
    },
    fullscreen: false,
    hiddenButtons: ["cmdUrl","cmdImage"],
    additionalButtons: [[{
      name: "groupCustom",
      data: [{
        name: "cmdCr",
        toggle: true, // this param only take effect if you load bootstrap.js
        title: "Paragraph",
        icon: "icon fa fa-level-down",
        callback(e) {
          let chunk = undefined;
          let cursor = undefined;
          const selected = e.getSelection();
          if (selected.length === 0) {
            chunk = "";
          } else {
            chunk = selected.text;
          }
          e.replaceSelection(chunk + "  \n");
          cursor = selected.end + 3;
          return e.setSelection(cursor, cursor + chunk.length);
        }
      }
      ]
    }
      , {
        name: "groupCustom",
        data: [{
          name: "cmdNoFormat",
          toggle: true, // this param only take effect if you load bootstrap.js
          title: "Pas de format",
          icon: "fa fa-file-o",
          callback(e) {
            let chunk = undefined;
            let cursor = undefined;
            const selected = e.getSelection();
            if (selected.length === 0) {
              chunk = "";
            } else {
              chunk = selected.text;
            }
            e.replaceSelection('\n    '+chunk);
            cursor = selected.end + 5;
            return e.setSelection(cursor, cursor + chunk.length);
          }
        }
        ]
      }
    ]]
  });
});

Template._inputBelongs_to.onRendered(function() {
  const dom = this.$(".chosen-select");
  /*
  dom.chosen().change (event) ->
    classArray = $(this).attr("class").split(/\s+/)
    *todo remove from package. should be available from project
    BkProject.callGenRefOnEvent event, true,"externalReference"  if _.contains(classArray, "generateReference")
  */
  const container = dom.next(".chosen-container");
  container.css("width", "300px");
  if (container.closest('.ui-dialog-content').length !== 0) {
    return container.find(".chosen-drop").css("max-height", container.closest('.ui-dialog-content').height()+"px");
  } else {
    return container.find(".chosen-drop").css("max-height", "400px");
  }
});

Template._inputAutoCompleteBelongs_to.onRendered(function() {
  const pref = this.data._pref;
  let klass = pref.class || this.data.field;
  klass = _.titleize(klass);
  const self = this;
  const {
    field
  } = self.data;
  this.$(".typeahead").typeahead({
    source(query, process) {
      return Meteor.call("autoComplete", query, klass, function(err, response) {
        if (!err) {
          return process(response);
        }
      });
    },
    displayText(item){
      return item.name;
    },
    afterSelect(item) {
      self.data.model.set(field,item.value);
      return self.data.model.isValid(field);
    }
  });
});

Template._inputBelongs_to_many.onRendered(function() {
  const klass = this.data.model.constructor._fields[this.data.field].class;
  const self = this;
  $(".typeahead").typeahead(
    {
      highlight: true,
      hint: true
    },
    {
      displayKey: 'name',
      source(query, process) {
        const names = [];
        return Meteor.call("autoComplete", query, klass, function(err, response) {
          if (!err) {
            return process(response);
          }
        });
      }
    }
  ).bind("typeahead:selected", function(event,item,name) {
    if (self.data.model.attributes[self.data.field] === undefined) {
      self.data.model.attributes[self.data.field] = [];
    }
    self.data.model.attributes[self.data.field].push(item.value);
    self.data.model.save(self.data.field);
    return $(event.target).typeahead('val',undefined);
  });
});

Template._inputHas_many.onRendered(function() {
  this.find(".chosen-select-multi").chosen();
  this.find(".chosen-container").css("width", "300px");
  if (this.find(".chosen-container").closest('.ui-dialog-content').length !== 0) {
    return this.find(".chosen-drop").css("max-height", $(".chosen-container").closest('.ui-dialog-content').height()+"px");
  } else {
    return this.find(".chosen-drop").css("max-height", "400px");
  }
});

Template._inputColor.onRendered(function() {
  if (!this.data) { return; }
  const self = this.data;
  const dom = $(this.find(".color-picker"));

  if (_.isUndefined(self._.values)) {
    //TODO Bugfix - this is not working
    return dom.colorpicker();
  } else {
    return dom.ace_colorpicker().on('change', function() {
      if (self.inlineEdit) { // Inline edit input
        const {
          model
        } = self;
        model.attributes[self._.field] = this.value;
        return model.save();
      } else {
        return dom.prev().val(this.value);
      }
    });
  }
});