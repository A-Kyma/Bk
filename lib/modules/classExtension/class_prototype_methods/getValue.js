import traverse from "../../core/utils/traverse";
import I18n from "../../../classes/i18n";
import Enum from "../../customFields/customs/Enum";

function getValue(field) {
  let value = this.get(field);
  if (value === undefined) return;

  let definition = this.getDefinition(field);
  let fieldType = definition.type.name;
  let EnumClass = definition.type.class

  if (! Enum.enums[fieldType]) return value;

  let identifiers = EnumClass.getIdentifiers();
  if (!identifiers.includes(value)) return value;
  return I18n.t("Enum." + fieldType + "." + value + ".label");
}

export default getValue;