<template>
  <div>
    <b-form-input
        v-bind="$attrs"
        v-model="inputValue"
        :list="datalistId"
    />
    <b-form-datalist :id="datalistId" :options="options"/>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy";
import {I18n} from "meteor/a-kyma:bk";

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
  },
  methods: {
    fillOptions(value) {
      self=this;
      if (value.length < 3) { return }
      this.model.callMethod("searchCityServer",value, I18n.getLanguage(),(err,result) => {
        self.options = result;
      })
    }
  },
}
</script>

<style scoped>

</style>