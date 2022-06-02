<template>
  <b-nav-item-dropdown v-if="view==='dropdown'" right>
    <template #button-content>
      <b-icon icon="flag-fill"/>
    </template>
    <b-dropdown-item
        v-for="lang in locales"
        :active="isActive(lang)"
        @click="onClick(lang)"
    >
      <t>{{translate(lang)}}</t>
    </b-dropdown-item>
  </b-nav-item-dropdown>

  <b-row v-else-if="view==='flags'">
    <b-col v-for="lang in locales" class="p-0">
      <b-link @click="onClick(lang)">
        <span :class="'fi fi-'+lang"> </span>
      </b-link>
    </b-col>
  </b-row>
</template>

<script>
  import {Class} from "meteor/jagi:astronomy"
  import I18n from "../../../../lib/classes/i18n";
  import Languages from "../../../../lib/modules/customFields/types/language";
  import config from "../../../../lib/core/config";


  export default {
    name: "BkLanguage",
    props: {
      view: {
        type: String,
        default: "dropdown"
      },
    },
    data() {
      return {
        active: I18n.getLanguage(),
      }
    },
    computed: {
      locales() {
        return Meteor.settings?.public?.translation?.locales || config.translation.locales;
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
        this.$emit("change",lang)
      }
    },
    meteor: {
    }
  }
</script>

<style scoped>
/* https://flagicons.lipis.dev */
.fi {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
}
.fi:before {
  content: '\00a0';
}
.fi-de {
  background-image: url(../../flags/de.svg);
}
.fi-es {
  background-image: url(../../flags/es.svg);
}
.fi-fr {
  background-image: url(../../flags/fr.svg);
}
.fi-en {
  background-image: url(../../flags/gb.svg);
}
.fi-it {
  background-image: url(../../flags/it.svg);
}
.fi-nl {
  background-image: url(../../flags/nl.svg);
}
</style>