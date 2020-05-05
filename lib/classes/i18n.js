import {Class}           from 'meteor/jagi:astronomy';
import { _ }             from 'meteor/underscore';
import { ReactiveVar }   from 'meteor/reactive-var';
import { ReactiveDict }  from 'meteor/reactive-dict';
import { check, Match }  from 'meteor/check';
import config from "../core/config";

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

function replaceVariables(result, variables) {
  for (let k in variables) {
     result = result.replace(eval("/__"+k+"__/g"),variables[k]);
  }
  return result;
}

const I18n = Class.create({
  name: 'I18n',
  collection: new Mongo.Collection('i18n'),
  secured: false,
  fields: {
    key: { type: String, name: 1},
    locale: { type: Languages },
    text: { type: String }
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

I18n.currentLanguage = new ReactiveVar(config.translation.defaultLanguage);
I18n.locales = ["en","fr","nl","de"];
I18n.map = new ReactiveDict();

I18n.setLanguage = function(lang) {
  check(lang,String);
  if (this.locales && this.locales[lang]) {
      this.currentLanguage.set(lang);
  } else {
    throw new Meteor.Error("404", "No such language: ${lang}");
  }
}

I18n.get = function(key,options={}) {
  check(key,String);
  let lang = this.currentLanguage.get() || this.defaultLanguage || 'en';

  if (!_.isUndefined(options.count)) {
    switch (options.count) {
      case 0:
        key += ".zero";
      case 1:
        key += ".one";
      default:
        key += ".other";
    }
  }
  let localKey = lang + '.' + key;
  let defaultKey = config.translation.defaultLanguage + '.' + key;

  let result = this.map.get(localKey) || this.map.get(defaultKey);

  if (_.isFunction(result)) {
    result = result.call(this);
  }

  if (_.isEmpty(result)) {
    return key;
  }

  return replaceVariables(result, options);
}

I18n[config.translation.helperName] = function (key,options) {
  return I18n.get(key,options);
}

//TODO: probably not working
I18n.loadTranslations = function(translations) {
  check(translations,Object);

  for (let lang in translations) {
    this.locales.push(lang);
    this.map.set(convertToDottedTranslations.call(this,lang,translations));
  }
}

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