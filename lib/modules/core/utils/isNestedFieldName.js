import { Module } from 'meteor/jagi:astronomy'

function isNestedFieldName(fieldPattern) {
  if (fieldPattern === undefined) return false
  f = Module.modules["fields"].utils.isNestedFieldName
  return f(fieldPattern)
}

export default isNestedFieldName;