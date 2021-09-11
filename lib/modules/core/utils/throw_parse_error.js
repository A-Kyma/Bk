import { Module } from 'meteor/jagi:astronomy';

function throwParseError(details) {
  const f = Module.modules["core"].utils.throwParseError;
  return f(details);
};

export default throwParseError;