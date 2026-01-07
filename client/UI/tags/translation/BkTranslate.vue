<template>
  <span @click.meta.exact.capture="showKey">{{translation}}</span>
</template>

<script setup>
defineOptions({ name: 't' })
import { computed, useSlots, ref } from 'vue'
import { autorun } from 'vue-meteor-tracker'
import { Class } from "meteor/akyma:astronomy"
import { Role } from "meteor/akyma:bk"
import I18n from "../../../../lib/classes/i18n"
import BkForm from "../forms/BkForm.vue"

const props = defineProps({
  model: [Class, String],
  field: String,
  options: {
    type: Object,
    default: () => ({})
  },
  locale: String,
})

const slots = useSlots()
let toast
if (Meteor.isClient) {
  toast = require('bootstrap-vue-next').useToast
}

// Compute the translation key from model/field or slot content
const key = computed(() => {
  if (props.model && props.field) {
    if (typeof(props.model) === "string") {
      return Class.get(props.model).getLabelKey(props.field)
    } else {
      return props.model.constructor.getLabelKey(props.field)
    }
  }
  
  // Extract key from default slot
  const defaultSlot = slots.default?.()
  if (defaultSlot && defaultSlot.length > 0) {
    const firstChild = defaultSlot[0]
    if (firstChild.children && typeof firstChild.children === 'string') {
      return firstChild.children.trim()
    }
    // Fallback for text type children
    if (firstChild.type === Symbol.for('v-txt')) {
      return String(firstChild.children || '').trim()
    }
  }
  return ''
})

// Reactive translation computed from I18n
const translation = autorun(() => {
  //if (!key.value) return ''
  const options = { ...props.options }
  if (props.locale) {
    options.locale = props.locale
  }
  return I18n.t(key.value, options)
}).result

// Handle meta+click to edit translation
const showKey = (e) => {
  e.preventDefault()
  if (!Meteor.isClient) return
  if (!Role.is("SuperAdministrator")) return
  
  const locale = I18n.getLanguage()
  const translationKey = key.value
  
  let t = I18n.findOne({ locale, key: translationKey })
  if (!t) {
    t = new I18n({ locale, key: translationKey, text: translation.value })
  }
  if (t.text.includes(".")) {
    t.text = ""
  }
  
  // Show toast with BkForm to edit translation
  toast?.toast({
    title: "Translation",
    body: () => (
      // Return component instance for toast
      // Note: Bootstrap Vue 3 toast expects string or component
      `<bk-form :model="model" :toast="true"></bk-form>`
    ),
  })
}
</script>

<style scoped>

</style>