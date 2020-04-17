import Module from 'meteor/jagi:astronomy';

function traverse(doc, name, callback) {
  f = Module.modules["fields"].utils.traverse;
  return f(doc, name, callback);
};

export default traverse;