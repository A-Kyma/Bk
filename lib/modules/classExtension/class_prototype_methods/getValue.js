import traverse from "../../core/utils/traverse";
import I18n from "../../../classes/i18n";
import Enum from "../../customFields/customs/Enum";

function getValue(field) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldType = definition.type.name;
  let fieldClass = definition.type.class

  if (!["Enum","Lifecycle"].includes(fieldClass.name)) return value;
  return I18n.t(fieldClass.getLabelKey(value));
}

export default getValue;