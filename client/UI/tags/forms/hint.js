import './hint.html';
import I18n from "../../../../lib/classes/i18n";

Template._hint.helpers({
  hint() {
    let hint;
    if (this._pref.noHint) { return; }
    const key = this.model.constructor.getName() + "." + this.field + ".hint";
    const translation = I18n.t(key);
    if (translation !== key) { hint = translation; }
    return hint;
  }
});