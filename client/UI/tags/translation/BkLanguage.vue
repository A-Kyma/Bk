<template>
    <b-nav-item-dropdown right>
      <template #button-content>
        <b-icon icon="flag-fill"/> Lang
      </template>
      <b-dropdown-item
          v-for="lang in locales"
          :active="isActive(lang)"
          @click="onClick(lang)"
      >
         {{ translate(lang) }}
      </b-dropdown-item>
    </b-nav-item-dropdown>
</template>

<script>
  import Class from "meteor/jagi:astronomy"
  import {Bk} from "../../../../lib/lib.js"
  import I18n from "../../../../lib/classes/i18n";
  import Languages from "../../../../lib/modules/customFields/types/language";

  export default {
    name: "BkLanguage",
    data() {
      return {
        active: I18n.getLanguage(),
      }
    },
    computed: {
      locales() {
        return I18n.locales;
      }
    },
    methods: {
      isActive(lang) {
        return this.active === lang;
      },
      translate(lang) {
        return Languages[lang];
      },
      onClick(lang) {
        I18n.setLanguage(lang);
        this.active = lang;
      }
    },
    meteor: {
    }
  }
</script>

<style scoped>

</style>