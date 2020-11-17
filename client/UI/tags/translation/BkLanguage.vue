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
        <t>{{translate(lang)}}</t>
      </b-dropdown-item>
    </b-nav-item-dropdown>
</template>

<script>
  import {Class} from "meteor/jagi:astronomy"
  import I18n from "../../../../lib/classes/i18n";
  import Languages from "../../../../lib/modules/customFields/types/language";
  import config from "../../../../lib/core/config";

  export default {
    name: "BkLanguage",
    data() {
      return {
        active: I18n.getLanguage(),
      }
    },
    computed: {
      locales() {
        return config.translation.locales;
      }
    },
    methods: {
      isActive(lang) {
        return this.active === lang;
      },
      translate(lang) {
        return Languages.getLabelKey(lang);
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