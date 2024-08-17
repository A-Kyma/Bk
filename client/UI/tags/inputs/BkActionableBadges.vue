<template>
  <span v-if="readonly && !isArray && !options" class="mr-1 ml-1">
    <b-badge :variant="value" class="p-1">
      <slot name="default">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </b-badge>
    <slot name="after"/>
  </span>
  <div v-else-if="readonly && options" class="form-control-plaintext">
    <b-badge
        v-for="item in options"
        :key="item._id"
        :variant="item.variant"
        class="p-1 mr-1"
    >
      <slot name="default" v-bind="{item}">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </b-badge>
    <slot name="after"/>
  </div>
  <div v-else-if="readonly && isArray && !options" class="form-control-plaintext">
    <b-badge v-for="variant in value" :key="variant" :variant="variant" class="p-1 mr-1">
      <slot name="default">
        &nbsp;&nbsp;&nbsp;
      </slot>
    </b-badge>
    <slot name="after"/>
  </div>
  <div v-else class="form-control-plaintext">
    <b-badge
        v-for="(item,index) in options"
        :key="item.value"
        :class="'ml-1 mr-1 ' + getClass(item.value)"
        :variant="item.value"
        href="#"
        @click="onClick(item)"
    >
      <slot name="default">
        {{(index+1).toLocaleString('en', {minimumIntegerDigits: options.length.toString().length})}}
      </slot>
    </b-badge>
  </div>
</template>

<script>
// TODO choose variant color or other using actionable badge (it's selected when "focus")
// See https://bootstrap-vue.org/docs/components/badge#actionable-badges
import {Class} from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n";

export default {
  name: "BkActionableBadges",
  props: {
    model: Class,
    field: String,
    options: Array,
    for: String,
    disabled: Boolean,
    state: Boolean,
    value: [String,Array]
  },
  computed: {
    readonly() {
      return this.$props['for'] === "view" || this.disabled
    },
    isArray() {
      return Array.isArray(this.value)
    }
  },
  methods: {
    getClass(itemValue) {
      if (this.isArray && this.value.includes(itemValue))
        return "checked"
      if (itemValue === this.value)
        return "checked"
      return ""
    },
    onClick(item) {
      this.$emit("input",item.value)
      this.model[this.field] = item.value
    }
  },
}
</script>

<style scoped>
/*
a.badge-success.focus {
    outline:0; box-shadow:0 0 0 .2rem rgba(220,53,69,.5)} // shadow autour, de la couleur choisie
    color: #fff; // Couleur du texte
    background-color: #1e7e34; // changement de la couleur background (un peu plus foncé)
    text-decoration: none; // Evite de souligner car il faut ajouter un href="#" pour qu'il soit clickable
}
*/

</style>