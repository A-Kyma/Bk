class BkError extends Bk {
  static addError(model,field,key,options) {
    if (options == null) { options = {}; }
    const klass = model.constructor;
    if (_.isEmpty(field)) {
      field = "_global";
      options.field = I18n.t("error.global");
    } else {
      options.field = I18n.t(klass._type + "." + field.replace('_id','') + '.label');
    }
    if (Meteor.isClient) {
      //      model.errors[field] = I18n.t(key, options)
      model.setError(field,key,options);
      if (field === "_global") { insertError(model.errors[field]); }
    }
    if (Meteor.isServer) {
      console.log("Throw error " + key + " for field " + field);
      throw new Meteor.Error(422,"Model " + klass._type + ((model.id && ("("+model.id+")")) || "") + " validation failed on field " + field + ".",{message: {key, options}, class: klass._type, field, modified_attributes: model.modified_attributes});
    }
  }

  static throwError(tagErrorName, field, tag) {
    const templateName = '_'+tagErrorName;
    const context = {
      template: templateName,
      field,
      tag
    };
    return context;
  }
}