import { Module } from 'meteor/jagi:astronomy';

// callback should have nestedDoc, nestedName, fieldDefinition as arguments
function traverse(doc, name, callback) {
  const f = Module.modules["fields"].utils.traverse;
  return f(doc, name, callback);
};

export default traverse;