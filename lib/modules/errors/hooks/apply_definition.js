// I18n has to be imported dynamically, to ensure all module are loaded
// Before I18n is creating its class
//import I18n from "../../../classes/i18n";

import {DateTime} from "../../customFields/module"

function onApplyDefinition(Class, parsedDefinition, className) {
  //import("../../../classes/i18n").then(I18nModule =>
  Class.extend({
    resolveError({className, doc, name, nestedName, value, validator, param}) {
      const I18n = Class.get("I18n")
      //let I18n = I18nModule.default;
      let fieldLabel = doc.constructor.getLabelKey(nestedName);
      let field = I18n.get(fieldLabel);
      let count;
      if (["length","minLength","maxLength","min","max"].includes(validator)) {
        count = param;
      }
      if (["lifecycle","enum"].includes(validator)) {
        let EnumClass = doc.getFieldClass(name)
        let valueLabel = EnumClass.getLabelKey(value)
        value = I18n.get(valueLabel)
        let paramLabel = EnumClass.getLabelKey(param)
        param = I18n.get(paramLabel)
      }
      if (value instanceof Date) {
        param = DateTime.getLongDateTime(param)
      }
      return I18n.get("Error." + validator,{doc, name, nestedName, field, value, param, count});
    }
  }, ["validators"])
//)
};

export default onApplyDefinition;