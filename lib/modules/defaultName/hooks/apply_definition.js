import _has from 'lodash/has';

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
};

export default onApplyDefinition;