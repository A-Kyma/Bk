import {Class} from 'meteor/akyma:astronomy';
import {_} from 'meteor/underscore';
import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';
import { ReactiveMap } from 'meteor/jagi:reactive-map';

import {check} from 'meteor/check';
import config from "../core/config";
import {DateTime} from "../modules/customFields/module";

import Languages from '../modules/customFields/types/language';
import getLabelKey from "../modules/labels/class_static_methods/getLabelKey";
import getDefinition from "../modules/classExtension/class_static_methods/getDefinition";
import getError from "../modules/errors/class_prototype_methods/getError";
import isPersisted from "../modules/classExtension/class_prototype_methods/isPersisted";
import getFieldsNamesByFilter from "../modules/classExtension/class_static_methods/getFieldsNamesByFilter";
import setError from "../modules/errors/class_prototype_methods/setError";
import clearError from "../modules/errors/class_prototype_methods/clearError";
import getStaticDefinition from "../modules/classExtension/class_static_methods/getDefinition";
import canEdit from "../modules/permissions/class_prototype_methods/canEdit";
import canCreate from "../modules/permissions/class_prototype_methods/canCreate";
import canUpdate from "../modules/permissions/class_prototype_methods/canUpdate";

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

function replaceLocaleVariable(result,options) {
  let variableKeys = result.match(/\{\{\$\w+\}\}/g)
  if (variableKeys) {
    variableKeys.forEach((elem) => {
      const k = elem.match(/\$\w+/).shift()

      let value = I18n.get(k.toLowerCase() + ".label",{...options,ignoreNotFound: true})

      if (!value) return

      // Get content at the same case as it variable was written in the translation
      if (k.toUpperCase() === k) value = value.toUpperCase()
      else if (k.toLowerCase() !== k) value = value.charAt(0).toUpperCase() + value.slice(1)

      result = result.replace(eval("/\{\{\\$"+k.slice(1)+"\}\}/g"),value)
    })
  }
  return result
}

function getContextValue(k,contextValue,askedKey) {
  let resultKeyArray = askedKey.split(".")
  let lastElem = resultKeyArray.pop()
  let resultKey = resultKeyArray.join(".")
  let value
  if (contextValue) {
    let contextKey = resultKey + ".context." + contextValue
    value = I18n.get(contextKey, {ignoreNotFound: true})
  }
  if (!value)
    value = I18n.get(resultKey + ".context." + lastElem,{ignoreNotFound: true})
  if (!value)
    value = resultKey + ".context." + contextValue

  return value
}

function replaceContext(result,askedKey) {
  if (!result.includes("{{context")) return result
  let resultKeyArray = askedKey.split(".")
  let lastElem = resultKeyArray.pop()
  let resultKey = resultKeyArray.join(".")
  const contextKeys = I18n.getAllContext()

  if (Object.entries(contextKeys).length === 0) {
    let value = I18n.get(resultKey + ".context." + lastElem)
    return result.replace(eval("/\{\{context\.\\w+\}\}/g"),value)
  }

  Object.entries(contextKeys).forEach(([contextKey,contextValue]) => {
    let k = "context." + contextKey
    if (!result.includes("{{"+k+"}}")) return

    let value = I18n.get(resultKey + ".context." + contextValue,{ignoreNotFound: true})
    if (!value)
      value = I18n.get(resultKey + ".context." + lastElem,{ignoreNotFound: true})
    if (!value)
      value = resultKey + ".context." + contextValue
    result = result.replace(eval("/\{\{"+k+"\}\}/g"),value)
  })

  return result
}

function replaceVariables(result, variables, askedKey) {
  /* variables $key*/
  result = replaceLocaleVariable(result,variables)

  /* replacing variable in options */
  for (let k in variables) {
    let value = variables[k]

    if (k.includes(".")) {
      if (k.startsWith("context.")) {
        value = getContextValue(k,value,askedKey)
      } else {
        let allowedOptions = {
          locale: variables.locale
        }
        Object.entries(variables).forEach(([optionKey,optionValue]) => {
          if (optionKey.startsWith("context."))
            allowedOptions[optionKey] = optionValue
        })
        value = I18n.get(k + "." + value + ".label", allowedOptions)
      }
    }

    if (value instanceof Date) {
      if (variables.format === "longDate"){
        value = DateTime.getLongDate(value,variables.locale)
      }else{
        value = DateTime.getLongDateTime(value,variables.locale)
      }
    }
    result = result.replace(eval("/\{\{"+k+"\}\}/g"),value);
  }
  result = replaceContext(result,askedKey)
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
  },
  events: {
    // e.target = upper document, e.currentTarget = nearest Class
    beforeInit(e) {
      e.currentTarget._errors = new ReactiveMap({});
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
I18n.currentContext = new ReactiveDict()

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

I18n.setContext = function(dict) {
  if (!dict) return I18n.clearContext()
  for (const [key,value] of Object.entries(dict)) {
    this.currentContext.set(key,value)
  }
}
I18n.getContext = function(key) {
  return this.currentContext.get(key)
}
I18n.getAllContext = function() {
  return this.currentContext.all()
}
I18n.clearContext = function() {
  this.currentContext.clear()
}

// Missing definition since I18n is created before
I18n.getLabelKey = getLabelKey
I18n.getDefinition = getStaticDefinition
I18n.getFieldsNamesByFilter = getFieldsNamesByFilter
I18n.prototype.getDefinition = getDefinition
I18n.prototype.getError = getError
I18n.prototype.setError = setError
I18n.prototype.clearError = clearError
I18n.prototype.isPersisted = isPersisted


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

  return replaceVariables(result, options, key);
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