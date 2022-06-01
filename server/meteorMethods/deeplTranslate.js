import config from "../../lib/core/config";
import {check, Match} from 'meteor/check';
import { HTTP } from 'meteor/jkuester:http'

const deeplUrl = "https://api-free.deepl.com/v2/translate"
Meteor.methods({
  deeplTranslate(text,lang) {
    const key = config.translation.deeplKey
    check(text,String)
    check(lang,String)

    let headers = {
      Accept: 'application/json',
      "User-Agent": "Meteor/" + Meteor.release
    }

    let params = {
      auth_key: key,
      text: text,
      source_lang: "FR",
      target_lang: lang.toUpperCase(),
    }

    let response = HTTP.post(deeplUrl,{headers,params})
    let result = JSON.parse(response.content)

    if (!Array.isArray(result.translations) || result.translations.length < 1)
      throw new Meteor.Error("Unknown error")

    return result.translations[0].text
  }
})