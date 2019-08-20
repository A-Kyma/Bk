import { _ }             from 'meteor/underscore';
import { ReactiveVar }   from 'meteor/reactive-var';
import { check, Match }  from 'meteor/check';

function convertToDottedTranslations(lang,translations,depth) {
  let result={};
  for (let k in translations) {
    let v = translations[k];
    let dottedKey;
    if (depth) {
      dottedKey = depth + "." + k;
    } else{
      dottedKey = k;
    }
    if (_.isObject(v)) {
      result = _.extend(result, convertToDottedTranslations.call(this,lang,v,dottedKey))
    } else {
      result[dottedKey] = translations[k];
    }
  }
  return result;
}

function replaceVariables(result, variables) {
  for (let v of variables) {

  }
  return result;
}

export default class I18N {
  /* @name I18n
   * @constructor
   * @summary Initialize I18n object with provided configuration
   * @param config
   * @param config.defaultLanguage {String} - Default language for I18n translation when translation not found.
   * @param config.translations {Object} - contains all translations to integrate
   * @param config.dataSource {String} - Is "database" when we need to get translations from database
   */
  constructor(config={}) {
    let key;
    const self = this;
    this.defaultLanguage = config.defaultLanguage || 'en';
    this.dataSource = config.dataSource || "local";
    this.helperName = "t";
    this.currentLanguage = new ReactiveVar();

    this.map = {};
    this.locales = [];

    check(this.defaultLanguage,String);

    if (config && config.translations) {
      check(config.translations, Object);
      this.loadTranslations(config.translations);
    }
  }

  setLanguage(lang) {
    check(lang,String);
    if (this.locales && this.locales[lang]) {
      this.currentLanguage.set(lang);
    } else {
      throw new Meteor.Error(404, "No such language: ${lang}");
    }
  }

  get(...args) {
    let lang = this.currentLanguage.get() || this.defaultLanguage || 'en';
    let key = args.shift();
    let variables = args;

    let localKey = lang + '.' + key;
    let defaultKey = this.defaultLanguage + '.' + key;

    let result = this.map[localKey] || this.map[defaultKey];

    if (_.isFunction(result)) {
      result = result.call(this);
    }

    result = replaceVariables(result, variables);
  }

  loadTranslations(translations) {
    check(translations,Object);

    for (let lang in translations) {
      this.locales.push(lang);
      this.map[lang] = convertToDottedTranslations.call(this,lang,translations[lang]);
    }
  }
}