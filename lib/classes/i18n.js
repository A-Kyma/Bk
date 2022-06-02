import {Class} from 'meteor/jagi:astronomy';
import {_} from 'meteor/underscore';
import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';
import {check} from 'meteor/check';
import config from "../core/config";
import {DateTime} from "../modules/customFields/module";

import Languages from '../modules/customFields/types/language';

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

function convertToObjectTranslations(translations,lang,nested) {
  let result = {}
  if (nested === undefined) nested = result
  for (let dottedKey in translations) {
    let value = translations[dottedKey]
    let keyArray = dottedKey.split(".")
    let key = keyArray.shift()
    if (keyArray.length === 0) {
      nested[key] = value
    } else if (keyArray.length === 1 && keyArray[0] === "") {
      nested[key+"."] = value
    } else {
      nested[key] ||= {}
      let nestedKey = keyArray.join(".")
      convertToObjectTranslations({[nestedKey]: value}, lang, nested[key])
    }
  }
  if (lang) return { [lang]: result[lang] }
  return result
}

function replaceVariables(result, variables) {
  for (let k in variables) {
    let value = variables[k]
    if (k.includes(".")) {
      value = I18n.get(k + "." + value + ".label", {locale: variables.locale})
    }
    if (value instanceof Date) {
      value = DateTime.getLongDateTime(value,variables.locale)
    }
    result = result.replace(eval("/\{\{"+k+"\}\}/g"),value);
  }
  return result;
}

const I18n = Class.create({
  name: 'I18n',
  collection: new Mongo.Collection('i18n'),
  secured: false,
  fields: {
    key: { type: String, canUpdate() { return false }, canCreate() { return false }},
    locale: { type: Languages, canUpdate() { return false }, canCreate() { return false }},
    text: { type: String, name: 1 }
  },
  indexes: {
    translation: {
      fields: {
        locale: 1,
        key: 1
      },
      options: {
        unique: true
      }
    }
  }
});

I18n.locales = Meteor.settings?.public?.translation?.locales || config.translation.locales;
let defaultLanguage = Meteor.settings?.public?.translation?.defaultLanguage || config.translation.defaultLanguage;
if (Meteor.isClient) {
  let navlang = navigator.language.substr(0,2);
  if (I18n.locales.includes(navlang)) {
    defaultLanguage = navlang;
  }
}

I18n.currentLanguage = new ReactiveVar(defaultLanguage);
I18n.map = new ReactiveDict();

I18n.getLanguage = function(locale) {
  if (Meteor.isServer && locale) return locale;
  return this.currentLanguage.get() || this.defaultLanguage || 'en';
}

I18n.setLanguage = function(lang) {
  check(lang,String);
  if (this.locales && this.locales.includes(lang)) {
    this.currentLanguage.set(lang)
  } else {
    throw new Meteor.Error("404", "No such language: ${lang}");
  }
}

I18n.get = function(key,options={}) {
  check(key,String);
  let lang = I18n.getLanguage(options.locale);

  // If we have so class inheritance
  let className = key.split(".").shift();
  let keyRemainder = key.split(".").slice(1).join(".");

  if (!_.isUndefined(options.count) && !isNaN(options.count)) {
    switch (options.count) {
      case 0:
        key += ".zero";
        break;
      case 1:
        key += ".one";
        break;
      default:
        key += ".other";
    }
  }

  let localKey = lang + '.' + key;
  let defaultKey = (Meteor.settings?.public?.translation?.defaultLanguage || config.translation.defaultLanguage) + '.' + key;

  let result = this.map.get(localKey) || this.map.get(defaultKey);

  if (_.isFunction(result)) {
    result = result.call(this);
  }

  // check translation in parent. Inheritance possible here
  if (_.isEmpty(result)) {
    if (Class.has(className)) {
      let c = Class.get(className)
      let p = c.getParent();
      if (p) {
        let newKey=p.getName() + "." + keyRemainder;
        return I18n.get(newKey,options);
      }
    }
    if (options.ignoreNotFound)
      return undefined
    else
      return key;
  }

  // If Enum or Lifecycle, we can translate the identifiers / states here
  if (Array.isArray(options.param) && options.doc && options.nestedName) {
    let classDefinition = options.doc.getFieldClass(options.nestedName);
    if (typeof(classDefinition.getLabelKey) === "function") {
      let param = [];
      _.each(options.param,(value) => {
        param.push(I18n.get(classDefinition.getLabelKey(value)));
      })
      options.param = param.join(", ");
    }
    classDefinition = options.doc.getDefinition(options.nestedName).relation
    if (classDefinition) {
      let param = classDefinition.find({_id: {$in: options.param}}).map(e=>e.defaultName())
      options.param = param.join(", ")
    }
  }

  return replaceVariables(result, options);
}
let helperName = Meteor.settings?.translation?.helperName || config.translation.helperName
I18n[helperName] = function (key,options) {
  return I18n.get(key,options);
}

//TODO: probably not completely working
I18n.loadTranslations = function(translations) {
  check(translations,Object);

  for (let lang in translations) {
    if (!this.locales.includes(lang)) {
      continue;
    }
    this.map.set(convertToDottedTranslations.call(this,lang,translations));
  }
}

I18n.convertToObjectTranslations = convertToObjectTranslations

if (Meteor.isServer) {
  Meteor.publish('current_language_records', function(lang) {
    check(lang, String);
    if (lang) {
      return I18n.getCollection().find({locale: lang});
    }
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    Meteor.subscribe("current_language_records", I18n.currentLanguage.get())
  });
}

I18n.getCollection().find().observe({
  added(doc) { return I18n.map.set(doc.locale + "." + doc.key, doc.text); },
  changed(doc) { return I18n.map.set(doc.locale + "." + doc.key, doc.text); },
  removed(doc) { return delete I18n.map.set(doc.locale + "." + doc.key, undefined); }
});

export default I18n;