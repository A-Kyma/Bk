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
      <b-link @click="onClick(lang,true)">
          <span :class="'fi fi-'+lang"> </span>
      </b-link>
    </b-col>
  </b-row>

  <div v-else-if="view==='nav'" >
    <b-navbar-nav>
      <b-nav-item-dropdown ref="flagdropdown" class="flag-dropdown">
        <template #button-content>
          <span :class="'flags rounded-circle flags fi-1x1-'+active"> </span>
        </template>
        <b-dropdown-item v-for="lang in locales" @click="onClick(lang)" class="flag-item">
          <span :class="'rounded-circle flags fi-1x1-'+lang"> </span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
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
      getLang(){
        return this.active
      },
      onClick(lang,close) {
        this.$emit("change",lang)
        I18n.setLanguage(lang);
        this.active = lang;
        if (close) this.$refs.flagdropdown.hide(true)
      }
    },
    meteor: {
    }
  }
</script>

<style>
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
.flags {
  background-repeat: no-repeat;
  display: block;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  flex-shrink: 0;
  width: 1.8rem;
  height: 1.8rem;
  font-size: inherit;
  font-weight: 400;
  line-height: 1;
  max-width: 100%;
  max-height: auto;
  text-align: center;
  overflow: visible;
  position: absolute;
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

.fi-1x1-de {
  background-image: url(../../flags/1x1/de.svg);
}
.fi-1x1-es {
  background-image: url(../../flags/1x1/es.svg);
}
.fi-1x1-fr {
  background-image: url(../../flags/1x1/fr.svg);
}
.fi-1x1-en {
  background-image: url(../../flags/1x1/gb.svg);
}
.fi-1x1-it {
  background-image: url(../../flags/1x1/it.svg);
}
.fi-1x1-nl {
  background-image: url(../../flags/1x1/nl.svg);
}
.flag-dropdown .nav-link {
  padding-top: 0px!important;
}
.flag-dropdown .dropdown-menu {
  width: 50px!important;
  min-width: 50px!important;
}
.flag-item{
  border: 0px;
  height: 35px;
  padding: 0px;
  background: none!important;
  box-shadow: none;
  width: 50px!important;
}
.flag-item a{
  padding: 0px 0px 0px 8px!important;
}
.flag-item a:hover{
  background: none!important;
}
</style>