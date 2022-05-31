<template>
  <div>
    <b-button variant="primary" @click="generateYml">
      Generate YAML
    </b-button>

    <bk-table
        model="I18n"
        :array="array"
        :fields="fields"
        :per-page="1000"
    >
      <template #head()="{field}">
        {{field}}
      </template>

      <template #cell(_id)="{model,field}">
          {{model[field]}}
      </template>

      <template #cell()="{model,field}">
        <b-form-input
            :id="field + '.' + model._id"
            :ref="'input-'+field+'.'+model._id"
            :tabindex="locales.indexOf(field)+1"
            type="text"
            v-model="model[field]"
            lazy
            @focus="toggleState(model,field,null)"
            @blur="saveTranslation(model,field,$event)"
        />
      </template>

    </bk-table>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import {I18n} from "meteor/a-kyma:bk"
import {dump} from "js-yaml"

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default {
  name: "BkTranslations",
  props: {
    locales: {
      type: Array,
      default() {return I18n.locales}
    },
  },
  computed: {
    availableKeys() {
      let result=[]
      for (let [key,value] of Object.entries(this.translationsList)) {
        let realKey = key.split(".").slice(1).join(".")
        result.push(realKey)
      }
      return result.filter((item,index) => result.indexOf(item) === index).sort()
    },
    fields(){
      return ["_id"].concat(this.locales)
    },
    array() {
      let result=[]
      this.availableKeys.forEach(key => {
        let elem = {_id: key}
        this.locales.forEach(locale => {
          elem[locale] = this.translationsList[locale + "." + key]
        })
        result.push(elem)
      })
      return result
    }
  },
  meteor: {
    translationsList() {
      return I18n.map.all()
    },
  },
  methods: {
    saveTranslation(model,locale,event) {
      const value = event.target.value
      const id = locale + "." + model._id
      if (this.translationsList[id] === value) return
      if (this.translationsList[id] === undefined && value ==="") return

      console.log("Saving: ",id,value)
      I18n.map.set(id,value)
      this.toggleState(model,locale,true)
    },
    toggleState(model,locale,value) {
      const ref = "input-" + locale + "." + model._id
      this.$refs[ref].state = value
    },
    generateYml() {
      const yml = dump(
          I18n.convertToObjectTranslations(this.translationsList),
          { sortKeys: true }
      )
      //console.log(yml)
      download("translations.yml",yml)
    }
  }
}
</script>

<style scoped>
input {
  width: 300px;
}
</style>