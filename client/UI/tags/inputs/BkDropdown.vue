<template>
  <b-dropdown :text="dropdownText">
    <b-dropdown-item v-for="item in options" :data-value="item.value" @click="onClick">
      {{item.text}}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import {Class} from "meteor/akyma:astronomy"
import I18n from "../../../../lib/classes/i18n";
import {_} from "lodash";

export default {
  name: "BkDropdown",
  props: {
    model: Class,
    field: String,
    options: Array,
  },
  computed: {
    dropdownText() {
      let value = this.model[this.field];
      if (value) {
        let translatedElem = this.options.find(elem => elem.value === value);
        if (translatedElem) { return translatedElem.text };
      }
      return "Choose";
    }
  },
  methods: {
    onClick(e) {
      let elem = this.options.find(x => x.text === e.target.innerText)
      this.model[this.field] = elem.value;
    }
  },
}
</script>

<style scoped>

</style>