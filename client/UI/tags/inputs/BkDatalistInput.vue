<template>
  <div>
    <b-form-input
        v-bind="$attrs"
        v-model="inputValue"
        :state="state"
        :list="datalistId"
    />
    <!-- TODO use collapse + selectable table instead -->
    <b-form-datalist :id="datalistId" :options="options"/>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import I18n from "../../../../lib/classes/i18n";
import {_} from "lodash";

export default {
  name: "BkDatalistInput",
  props: {
    model: Class,
  },
  data() {
    return {
      value: this.model.defaultName(),
      options: []
    }
  },
  computed: {
    /*
    options() {
      // Todo : return available values using Method
      return this.model.searchCity(this.value, I18n.getLanguage())
    },
    */

    inputValue: {
      set(value) {
        let self = this;
        this.fillOptions(value)
        this.value = value;
      },
      get() {
        return this.value;
      }
    },
    datalistId() {
      return "datalist_" + this.model._id;
    }
  }
}
</script>

<style scoped>

</style>