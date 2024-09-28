<template>
  <b-overlay
    :show="busy"
    rounded
    opacity="0.6"
    spinner-small
    :spinner-variant="variant"
    class="d-inline-block"
  >
    <b-button
      :disabled="busy"
      :variant="variant"
      :target="target"
      :href="xlsLink"
      @click.prevent="openLink($event,xlsLink,{method,...params})"
      v-bind="$attrs"
    >
      <b-icon-file-earmark-excel aria-hidden="true"/>
      <t>app.export</t>
  </b-button>
  </b-overlay>
</template>

<script>
import xlsExportMixins from "../../../utils/xlsExportMixins";

export default {
  name: "BkExportToXlsxButton",
  mixins: [xlsExportMixins],
  props: {
    params: Object,
    method: String,
    variant: {
      type: String,
      default: "dark"
    },
  },
  computed: {
    xlsLink() {
      if (Meteor.isCordova) {
        let result = {
          route: this.$route.name
        }
        if (this.method)
          result.method = this.method

        return this.xlsExportUrl({...result, ...this.params})
      }
    }
  }
}
</script>

<style scoped>

</style>