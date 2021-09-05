<template>
  <div v-if="readonly" class="col-12">
    <b-badge :variant="value">&nbsp;&nbsp;&nbsp;</b-badge>
  </div>
  <div v-else class="col-12 form-control-plaintext">
    <b-badge
        v-for="item in options"
        :key="item.value"
        :class="'ml-1 mr-1 ' + getClass(item.value)"
        :variant="item.value"
        href="#"
        @click="onClick(item)"
    >
      <t>{{item.key}}</t>
    </b-badge>
  </div>
</template>

<script>
// TODO choose variant color or other using actionable badge (it's selected when "focus")
// See https://bootstrap-vue.org/docs/components/badge#actionable-badges
import {Class} from "meteor/jagi:astronomy"
import I18n from "../../../../lib/classes/i18n";

export default {
  name: "BkActionableBadges",
  props: {
    model: Class,
    field: String,
    options: Object,
    for: String,
    disabled: Boolean,
    state: Boolean,
    value: String
  },
  computed: {
    readonly() {
      return this.$props['for'] === "view" || this.disabled
    },
  },
  methods: {
    getClass(itemValue) {
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