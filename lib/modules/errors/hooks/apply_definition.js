import _has from 'lodash/has';
import I18n from "../../../classes/i18n";

function onApplyDefinition(Class, parsedDefinition, className) {
  Class.extend({
    resolveError({className, doc, name, nestedName, value, validator, param}) {
      let fieldLabel = doc.constructor.getLabelKey(nestedName);
      let field = I18n.get(fieldLabel);
      let count;
      if (["length","minLength","maxLength","min","max"].includes(validator)) {
        count = param;
      }
      return I18n.get("Error." + validator,{doc, name, nestedName, field, param, count});
    }
  }, ["validators"])
};

export default onApplyDefinition;