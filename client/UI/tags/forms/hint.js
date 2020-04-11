import './hint.html';

Template._hint.helpers({
  hint() {
    let hint;
    if (this._pref.noHint) { return; }
    const key = this.model._type + "." + this.field + ".hint";
    const translation = I18n.t(key);
    if (translation !== key) { hint = translation; }
    return hint;
  }
});