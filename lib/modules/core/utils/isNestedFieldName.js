import Module from 'meteor/jagi:astronomy';

function isNestedFieldName(fieldPattern) {
  f = Module.modules["fields"].utils.isNestedFieldName;
  return f(fieldPattern);
};

export default isNestedFieldName;