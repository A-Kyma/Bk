import Bk from "../../lib/utils/BkLib";
import _ from 'lodash';

Bk._device = {
  userAgent: navigator.userAgent,
  isMobile() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      return true;
    }
  },
  isDatetimeCompatible() {
    if (/(C|c)hrome|(O|o)pera|(E|e)dge/i.test(navigator.userAgent)) {
      return true;
    }
  }
};


//#################################      PLAY SOUND      ##################################
Bk.mediaPlay = function (name) {
  let filePath, s;
  if (Meteor.isCordova) {
    filePath = cordova.file.applicationDirectory + "www/application/app/sounds/" + name;
    filePath = filePath.replace('file://', '');
    s = new Media(filePath);
  } else {
    filePath = "/sounds/" + name;
    s = new buzz.sound(filePath);
  }
  return s.play();
}

//#################################      CALLER      ##################################
Bk.callClearForm = function (e, values) {
  values = values.split(',');
  if (values.length !== 0) {
    const fields = values;
    return Array.from(fields).map((field) =>
      $(e.target.form).find('[name=' + field + ']').val(""));
  }
}
//    else
//      fields = c._fields
//      for field of fields
//        $(e.target.form).find('[name='+field+']').val("")

// DEPRECATED
Bk.callDom = function (e, DomId, options, parentDom) {
  e.preventDefault();
  let data = {};
  //parentDom = undefined
  if ($('#' + parentDom + '-container')[0] !== undefined) {
    $('#' + parentDom + '-container').remove();
  }
  const parent = $('#' + parentDom)[0];
  const {
    model
  } = options;
  const {
    id
  } = options;
  if (options.belong_id === undefined) {
    data = global[model].findInstance(id);
  } else {
    const selector = {};
    const {
      belong_id
    } = options;
    selector[belong_id] = id;
    data = global[model].toArray(selector);
  }
  const template = Template[DomId].extend({data});
  return Blaze.render(template, parent);
}

Bk.callFieldValidation = function (event, template, silent) {
  let value;
  const context = template.data;
  const {
    model
  } = context;
  const {
    field
  } = context;
  const pref = context._pref;
  const {
    fieldType
  } = context;
  if (context.inlineEdit) {
    return;
  }
  if (true) {
    let checked;
    switch (pref.type) {
      case "wysiwyg":
        value = $(template.find(".wysiwyg-editor")).html();
        break;
      case "boolean":
        value = event.target.checked;
        break;
      case "files":
        var {
          files
        } = event.target;
        if (files.length > 0) {
          value = [];
          const fileData = [];
          for (var file of Array.from(files)) {
            var basicInfoHash = {
              name: file.name,
              type: file.type,
              size: file.size
            };
            value.push(basicInfoHash);

            const reader = new FileReader();

            reader.onloadstart = () => Session.set("fileLoadPercentage", 0);

            reader.onprogress = function (progress) {
              const {
                total
              } = progress;
              const {
                loaded
              } = progress;
              return Session.set('fileLoadPercentage', ((loaded / total) * 100).toFixed(1));
            };

            reader.onloadend = function (event) {
              const res = event.target.result;
              const {
                profile
              } = template.data._pref;
              if (file.type.substring(0, 5) === "image") {
                const img = new Image();
                img.src = res;
                return img.onload = function () {
                  let activeFile, data_size, fileHash;
                  const data_url = Bk.getResizedPicture(img, profile);
                  if (profile) {
                    fileHash = {
                      binary: data_url
                    };
                    data_size = data_url.length;
                    basicInfoHash.size = data_size;
                    basicInfoHash.type = 'image/png';
                    const fType = _.last(basicInfoHash.name.split('.'));
                    const fName = basicInfoHash.name;
                    basicInfoHash.name = fName.replace(fType, 'png');
                    fileData.push(fileHash);

                    //add active file in value Array
                    activeFile = fileData[fileData.length - 1].binary;
                    value[fileData.length - 1].binary = activeFile;

                    //check for last file. If last => set value
                    if (files.length === value.length) {
                      return model.set(field, value);
                    }
                  } else {
                    let callback;
                    const newFile = File.new();
                    newFile.set('binary', data_url);
                    return newFile.save(null, null, (callback = function (err, id) {
                        if (_.isString(id)) {
                          fileHash = {
                            binary: id
                          };
                          data_size = data_url.length;
                          basicInfoHash.size = data_size;
                          basicInfoHash.type = file.type;
                          //fType = _.last(basicInfoHash.name.split('.'))
                          //fName = basicInfoHash.name
                          basicInfoHash.name = file.name;
                          fileData.push(fileHash);

                          //add active file in value Array
                          activeFile = fileData[fileData.length - 1].binary;
                          value[fileData.length - 1].binary = activeFile;

                          //check for last file. If last => set value
                          if (files.length === value.length) {
                            return model.set(field, value);
                          }
                        }
                      })
                    );
                  }
                };
              } else {
                let callback;
                const newFile = File.new();
                newFile.set('binary', event.target.result);
                return newFile.save(null, null, (callback = function (err, id) {
                    if (_.isString(id)) {
                      //the file is not an image
                      const fileHash = {
                        binary: id
                      };
                      fileData.push(fileHash);
                      const activeFile = fileData[fileData.length - 1].binary;
                      value[fileData.length - 1].binary = activeFile;
                      if (files.length === value.length) {
                        return model.set(field, value);
                      }
                    }
                  })
                );
              }
            };
            reader.readAsDataURL(file);
          }
        }
        break;
      default:
        if (fieldType === 'array') {
          ({
            value
          } = event);
        } else {
          ({
            value
          } = event.target);
        }
    }
    if (pref.type === "enumstring_many") {
      checked = $(event.target).prop("checked");
    }
    if (silent) {
      //This works only for first level field. TODO: This should be implemented in Minimongoid "set" function
      model.attributes[field] = value;
    } else {
      if (pref.type !== 'files') {
        model.set(field, value, checked);
      }
    }
  }
  if (model.isPersisted()) {
    template.userValue = model.get(field);
  }
  if (!context.noValidation) {
    if (model.isValid(field)) {
      //must empty input if model valid for array
      if (fieldType === 'array') {
        return event.value = "";
      }
    } else {
      //leave input with value and remove the value from the attribute
      if (fieldType === 'array') {
        return model.attributes[field].splice(-1, 1);
      }
    }
  }
}

Bk.getResizedPicture = function (img, profile) {
  let maxH, maxW;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let iw = img.width;
  let ih = img.height;
  if (profile !== undefined) {
    //for profile image we don't need big images.
    maxW = 100;
    maxH = 100;
  }
  if ((maxW === undefined) && (maxH === undefined)) {
    //images of more than 1000px*1000px are resized based on the biggest value
    if ((iw > 500) && (ih > 500)) {
      if (iw > ih) {
        maxW = 500;
        maxH = (ih / iw) * 500;
      }
      if (ih > iw) {
        maxH = 500;
        maxW = (iw / ih) * 500;
      }
    } else {
      maxW = iw;
      maxH = ih;
    }
  }
  if (profile !== undefined) {
    //for profile images we must set the image as a square before resize
    if (iw > ih) {
      iw = ih;
    } else {
      ih = iw;
    }
  }
  const scale = Math.min((maxW / iw), (maxH / ih));
  const iwScaled = iw * scale;
  const ihScaled = ih * scale;
  canvas.width = iwScaled;
  canvas.height = ihScaled;
  ctx.drawImage(img, 0, 0, iw, ih, 0, 0, iwScaled, ihScaled);
  return canvas.toDataURL();
}

Bk.callFormInline = function (e, context) {
  let field;
  const parentDom = $(e.target).closest(".input-inline-editable");
  const elements = parentDom.find("input,textarea,select"); // Search all inputs within class input-inline-editable
  if (elements.length === 0) {
    return;
  }
  elements.prop("disabled", true);
  Blaze.render(Template._loading, parentDom[0]);
  const {
    model
  } = context;
  for (let elem of Array.from(elements)) {
    model.set(elem.name, elem.value);
  }

  const dom = parentDom.find(".toggleLinkToEdit");
  //    clearErrors()
  if (elements.length === 1) {
    ({
      field
    } = context);
  }

  model.save(field, undefined, function (err) {
    if (err) {
      parentDom.find(".loading").remove();
      parentDom.remove(".loading");
      elements.prop("disabled", false);
      return false;
    } else {
      //   To Ensure input view is cancelled (for passwords, client side collection is not updated
      //   Then we don't have any reactive template update and helper clickToEdit is not reinitialized)
      dom.trigger("click");
      return true;
    }
  });

}

Bk.callModal = function (e, DomId, options, parentDom) {
  e.preventDefault();
  let data = {};
  const parent = parentDom || document.body;
  let width = 1000;
  const minHeight = 150;
  let height = 'auto';
  let position = {my: "center", at: "center", of: window};
  if (options !== undefined) {
    if (options.width !== undefined) {
      ({
        width
      } = options);
    }
    if (options.height !== undefined) {
      ({
        height
      } = options);
    }
    if (options.position !== undefined) {
      ({
        position
      } = options);
    }
  }
  const modalOptions = {
    modal: true,
    width,
    minHeight,
    height,
    position,
    close(event) {
      clearErrors();
      return $('#' + event.target.id).remove();
    }
  };
  if (options === undefined) {
    Blaze.render(Template[DomId], parent);
  } else {
    if (options.model === undefined) {
      if (options.data) {
        Blaze.renderWithData(Template[DomId], options.data, parent);
      } else {
        Blaze.render(Template[DomId], parent);
      }
    } else {
      const {
        model
      } = options;
      const {
        id
      } = options;
      if (options.belong_id === undefined) {
        data = global[model].findInstance(id);
      } else {
        const selector = {};
        const {
          belong_id
        } = options;
        selector[belong_id] = id;
        data = global[model].toArray(selector);
      }
      Blaze.renderWithData(Template[DomId], data, parent);
    }
  }
  return $('#' + DomId).modal('show');
}

Bk.callModelAction = function (event, templateOrModel, options) {
  let model;
  event.preventDefault();
  if (!_.isUndefined(templateOrModel.data)) {
    ({
      model
    } = templateOrModel.data);
  } else {
    model = templateOrModel;
  }

  if (event !== undefined) {
    options.event = event;
  }
  switch (options.action) {
    case 'delete':
      if (options.modal || confirm(I18n.t("submit.deleteConfirm"))) {
        return model.destroy();
      }
      break;
    case 'transition':
      return model.lifecycle(options.transition, true);
    default:
      return model.save(null, options);
  }
}

//#################################      GETTER      ##################################

// Give external representation of the value in view or input tags (following tag parameter)
Bk.getValueForField = function (context, tag) {
  let currentView, pref, res;
  let format;
  let model = context.model;
  let field = context.field;
  if (context._pref != null) {
    pref = context._pref;
  } else {
    pref = context._pref = model.getDefinition(field);
  }

  if (!model || !field || !pref) {
    return;
  }

  let valueType = pref.type.name;

  const value = context.value || model.get(field);

  //Set old value in template instance (_innerInput) during template rendering
  if (Template.instance()) {
    currentView = Template.instance().view;
    const innerInputTypeView = Blaze.getView(currentView, "Template._innerInputType");
    if (model.isPersisted() && currentView && !currentView.isRendered && innerInputTypeView && innerInputTypeView.templateInstance()) {
      innerInputTypeView.templateInstance().oldValue = value;
    }
  }
  if (_.isFunction(valueType) && valueType._fields && _.isUndefined(pref.embedded)) {
    valueType = 'belongs_to';
  }
  switch (valueType) {
    case 'lifecycle':
      if (tag === 'view') {
        res = I18n.t(model._type + ".lifecycle." + value);
      } else {
        res = Bk.getLifeCycleValues(model, field, value, context);
      }
      break;
    case 'version':
      if (tag === "view") {
        res = 'v. ' + value;
      }
      break;
    case 'date':
      res = (value && I18n.getDate(value)) || "";
      break;
    case 'time':
      //console.log '----------------------------'
      //console.log 'time'
      //console.log value
      //console.log '----------------------------'
      res = (value && I18n.getTime(value)) || "";
      break;
    case 'datetime':
      var isMobile = Bk._device.isMobile();
      var isDatetimeCompatible = Bk._device.isDatetimeCompatible();
      if (tag === "view") {
        //check if format forced in model field
        if (isMobile || isDatetimeCompatible) {
          if (pref.format) {
            ({
              format
            } = pref);
          } else {
            format = "YYYY-MM-DD HH:mm";
          }
          res = value && moment(value).format(format);
        } else {
          res = (value && (I18n.getDate(value) + " " + I18n.getTime(value))) || "";
        }
      } else {
        console.log('----------------------------');
        console.log('datetime');
        console.log(isMobile);
        console.log(isDatetimeCompatible);
        console.log('----------------------------');

        if (isMobile || isDatetimeCompatible) {
          format = "YYYY-MM-DD[T]HH:mm";
        } else {
          format = "YYYY-MM-DD HH:mm";
        }
        res = value && moment(value).format(format);
      }
      break;
    case 'enumstring':
      if (tag === "view") {
        res = Bk.getValueForEnumStr(model._type, value, field);
      } else {
        res = Bk.getEnumStringValues(model, field, value, context);
      }
      break;
    case 'radio':
      if (tag === "view") {
        res = Bk.getValueForEnumStr(model._type, value, field);
      } else {
        res = Bk.getRadioValues(model, field, value, context);
      }
      break;
    case 'enumstring_many':
      res = Bk.getEnumStringManyValues(model, field, value, context);
      break;
    case 'markdown':
      if ((typeof value === "string") && (tag === "view")) {
        res = markdown.toHTML(value);
      }
      break;
    case 'editor':
      if ((typeof value === "string") && (tag === "view")) {
        res = markdown.toHTML(value);
      }
      break;
    case 'color':
      if (tag === "input") {
        res = pref.colors;
      }
      break;
    //when 'file'
    //  if tag is "input"
    //    if !_.isUndefined(value) and _.isArray(value)
    //      for file in value
    //        file.uploadProgress = 100
    //        file.status = I18n.t("file.wereCompleted")
    //        SessionFiles.insert(file)
    case 'hash':
      if (pref !== undefined) {
        return (Array.from(_.without(_.keys(pref), "type")).map((subfield) => field + "." + subfield));
      }
      break;
    case 'array':
      if (value === undefined) {
        return undefined;
      } else {
        return (Array.from(_.keys(value)).map((idx) => field + "." + idx));
      }
      break;
    case 'belongs_to':
      if ((tag === "view") || pref.autocomplete) {
        res = Bk.getValueForBelongsTo(model, field, value, context);
      } else {
        res = Bk.getBelongsToStringValues(model, field, value, context);
        // When value change after rendered, it implies dependency or conflict, then index forced
        if (currentView.isRendered) {
          const select = Template.instance().find("select");
          let i = 0;
          while ((i < value.length) && !res[i].selected) {
            i++;
          }
          // When value of belongs_to is changed after render, refresh chosen jQuery plugin
          if (!context.noJq) {
            const dom = Template.instance().$(select);
            Meteor.defer(() => dom.trigger("chosen:updated"));
          }
        }
      }
      break;

    case 'belongs_to_many':
      if (tag === "view") {
        res = Bk.getValueForBelongsToMany(model, field, value, context);
      }
      break;

    case 'has_many':
      if (tag === "view") {
        res = Bk.getValueForBelongsTo(model, field, value, context);
      } else {
        res = Bk.getHasManyToStringValues(model, field, value, context);
      }
      break;
    default:
      res = value;
  }
  return res;
}

Bk.getBelongsToStringValues = function (model, field, currentValue, context) {
  let m;
  const pref = context._pref;
  //   Allow possibility to use allowBlank directly in the pref attributes. Very usefull for fieldList
  if (_.isUndefined(context.allowBlank)) {
    context.allowBlank = pref.allowBlank;
  }
  let valuesArray = ((() => {
    const result = [];
    for (m of Array.from(model.getAll(field))) {
      result.push({label: m.name, value: m.id, selected: m.id === currentValue});
    }
    return result;
  })());
  //   Check permission on allowedValues
  if (pref.allowedValues) {
    const allowedValues = pref.allowedValues(model.attributes);
    valuesArray = _.filter(valuesArray, m => Array.from(allowedValues).includes(m.value));
  }
  //   If combobox cannot be blank, we set first attribute to first value of the combobox
  if ((!pref.optional && !context.allowBlank) || (!context.allowBlank && !_.isUndefined(context.allowBlank))) {
    if (_.isUndefined(currentValue) && !_.isEmpty(valuesArray)) {
      model.set(field, valuesArray[0].value);
      valuesArray[0].selected = true;
    }
  } else {
    valuesArray = _.union([{
      label: I18n.t("app.undefined"),
      value: "",
      selected: _.isUndefined(currentValue)
    }], valuesArray);
  }
  return valuesArray;
}

Bk.getEnumStringManyValues = function (model, field, currentValue, context) {
  let valuesArray;
  try {
    let currentValues;
    const pref = context._pref;
    const {
      values
    } = pref;
    if (_.isUndefined(currentValue || _.isNull(currentValue))) {
      currentValues = [];
    } else if (typeof currentValue === "string") {
      currentValues = [currentValue];
    } else if (_.isArray(currentValue)) {
      currentValues = currentValue;
    }

    valuesArray = (Array.from(values).map((value) => ({
      label: model._type + ".enum_string." + field + "." + value,
      value,
      selected: _.contains(currentValues, value)
    })));
  } catch (e) {
    return [{
      label: "You have to define values in " + model._type + " @_fields definition for enumstringMany field " + field,
      value: 0
    }];
  }
  return valuesArray;
}

Bk.getEnumStringValues = function (model, field, currentValue, context) {
  let valuesArray;
  try {
    const pref = context._pref;
    let {
      values
    } = pref;
    if (typeof values === "function") {
      values = values(model.attributes);
    }
    valuesArray = (Array.from(values).map((value) => ({
      label: model._type + ".enum_string." + field + "." + value,
      value,
      selected: value === currentValue
    })));
    if (pref.optional || context.allowBlank) {
      valuesArray = _.union([{label: "app.undefined", value: "", selected: _.isUndefined(currentValue)}], valuesArray);
    }
    if (!pref.optional && !context.allowBlank && _.isUndefined(currentValue && !_.isEmpty(valuesArray))) {
      model.set(field, valuesArray[0].value);
      valuesArray[0].selected = true;
    }
  } catch (e) {
    return [{
      label: "You have to define values in " + model._type + " @_fields definition for enumstring field " + field,
      value: 0
    }];
  }
  return valuesArray;
}

Bk.getFormFiles = function (klass) {
  const pref = klass._fields;
  const values = {};
  for (let field in pref) {
    if (pref[field].type === 'file') {
      values[field] = [];
      for (let file of Array.from(SessionFiles.find().fetch())) {
        values[field].push({_id: file._id, filename: file.filename, size: file.size});
      }
      if (_.isEmpty(values[field])) {
        return {};
      } else {
        return values;
      }
    }
  }
  return {};
}

Bk.getHasManyToStringValues = function (model, field, currentValue, context) {
  const pref = context._pref;
  let valuesArray = (Array.from(model.getAll(field)).map((m) => ({
    label: m.name,
    value: m.id,
    selected: m.id === currentValue
  })));
  if (_.isEmpty(currentValue) || pref.optional || context.allowBlank) {
    valuesArray = _.union([{
      label: I18n.t("app.undefined"),
      value: "",
      selected: _.isUndefined(currentValue)
    }], valuesArray);
  }
  return valuesArray;
}

Bk.getLifeCycleValues = function (model, field, currentValue, options) {
  let valuesArray;
  try {
    const values = model.constructor[field];
    valuesArray = (Array.from(values).map((value) => ({
      label: I18n.t(model._type + ".lifecycle." + value),
      value,
      selected: value === currentValue
    })));
    if (options.allowBlank) {
      valuesArray = _.union([{
        label: I18n.t("app.undefined"),
        value: "",
        selected: _.isUndefined(currentValue)
      }], valuesArray);
    }
  } catch (e) {
    return [{
      label: "You have to define values in " + model._type + " @field_Name definition for lifecycle field " + field,
      value: 0
    }];
  }
  return valuesArray;
}

Bk.getMarkdownToHTML = function (o) {
  if (o.selector = '.viewMarkdown') {
    return Array.from(o).map((contents) =>
      (contents.innerHTML = markdown.toHTML(contents.innerHTML)));
  }
}

Bk.getRadioValues = function (model, field, currentValue, context) {
  let valuesArray;
  try {
    const pref = context._pref;
    let {
      values
    } = pref;
    if (typeof values === "function") {
      values = values(model.attributes);
    }
    valuesArray = (Array.from(values).map((value) => ({
      label: model._type + ".radio." + field + "." + value,
      value,
      selected: value === currentValue
    })));
  } catch (e) {
    return [{
      label: "You have to define values in " + model._type + " @_fields definition for radio field " + field,
      value: 0
    }];
  }
  return valuesArray;
}

Bk.getValueForBelongsTo = function (model, field, value, context) {
  if (!_.isEmpty(value)) {
//      relation = model.relations[field]
//      return unless relation
//      relation.name
    return value.name;
  }
}

Bk.getValueForBelongsToMany = function (model, field, values, context) {
  if (!context.count) {
    let i, pref, result, value;
    if (context._export) {
      if (_.isArray(values)) {
        pref = context._pref;
        result = "";
        for (i = 0; i < values.length; i++) {
          value = values[i];
          if (i === (values.length - 1)) {
            result = result + model.relations[field]({_id: value}).name;
          } else {
            result = result + model.relations[field]({_id: value}).name + ', ';
          }
        }
        return "[ " + result + " ]";
      } else {
        return "[  ]";
      }
    }
    if (_.isArray(values)) {
      pref = context._pref;
      result = [];
      for (i = 0; i < values.length; i++) {
        value = values[i];
        let url = "";
        let route = pref.relation || (pref.class && pref.class.toLowerCase()) || this.field;
        if (route !== undefined) {
          route += "Page";
          const pathDef = FlowRouter._routesMap[route] && FlowRouter._routesMap[route].path;
          const params = {id: value};
          url = FlowRouter.path(pathDef, params);
        }
        if (_.isEmpty(url)) {
          result.push({name: model.relations[field]({_id: value}).name, id: value, seq: i});
        } else {
          result.push({name: model.relations[field]({_id: value}).name, id: value, seq: i, url});
        }
      }
      return result;
    } else {
      return [];
    }
  } else {
    if (_.isArray(values)) {
      return values.length;
    } else {
      return 0;
    }
  }
}

Bk.getValueForEnumStr = function (modelName, value, field) {
  if (!_.isUndefined(value)) {
    return modelName + ".enum_string." + field + "." + value;
  }
}

Bk.getColor = function (letter, colorsHash) {
  if (letter === undefined) {
    return false;
  }
  letter = letter.toLowerCase();
  if (colorsHash === undefined) {
    colorsHash = {
      a: "cadetblue",
      b: "burlywood",
      c: "coral",
      d: "goldenrod",
      e: "cornflowerblue",
      f: "darkgoldenrod",
      g: "darkgray",
      h: "darkkhaki",
      i: "lightcoral",
      j: "lightpink",
      k: "darksalmon",
      l: "orchid",
      m: "darkseagreen",
      n: "darkolivegreen",
      o: "rosybrown",
      p: "skyblue",
      q: "indianred",
      r: "lightblue",
      s: "lightsteelblue",
      t: "mediumpurple",
      u: "olivedrab",
      v: "orchid",
      w: "palevioletred",
      x: "yellowgreen",
      y: "steelblue",
      z: "burlywood",
      1: "indianred",
      2: "lightblue",
      3: "lightsteelblue",
      4: "mediumpurple",
      5: "olivedrab",
      6: "orchid",
      7: "palevioletred",
      8: "yellowgreen",
      9: "steelblue",
      0: "burlywood"
    };
  }
  return colorsHash[letter];

}

export default Bk;