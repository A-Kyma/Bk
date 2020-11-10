import _has from 'lodash/has';
import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  if (parsedDefinition.defaultName) {
    Class.schema.defaultName = parsedDefinition.defaultName;
  }
  else {
    if (_has(Class.schema.fields,"name")) {
      Class.schema.defaultName = "name"
    } else {
      if (_has(Class.schema.fields, "title")) {
        Class.schema.defaultName = "title" //() => Class.prototype.get("title")
      }
    }
  }
  if (Class.schema.defaultName) {
    if (typeof Class.schema.defaultName === "string") {
      let name = Class.schema.defaultName;
      Class.schema.defaultName = ((field) => { return function() { return this.get(field) }})(name);
    }
    Class.prototype["defaultName"] = Class.schema.defaultName;
  }

  _each(parsedDefinition,function(fieldDefinition,fieldName) {
    if (fieldDefinition.label) {
      Class.schema.fields[fieldName].label = fieldDefinition.label;
    }
    if (fieldDefinition.placeholder) {
      Class.schema.fields[fieldName].placeholder = fieldDefinition.placeholder;
    }
  })

};

export default onApplyDefinition;