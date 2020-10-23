<template>
  <div>
    <b-form-input
        v-bind="$attrs"
        v-model="inputValue"
        type="search"
        :state="state"
        :list="datalistId"
    />
    <b-collapse :id="dropDownId" class="mt-2">
      <b-table
          hover
          borderless
          thead-class="d-none"
          value-td-class="d-none"
          :items="options"
          :fields='["value","text"]'
          @row-clicked="onSelectRow"
      >
        <template #cell(value)="data">

        </template>
      </b-table>
    </b-collapse>
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
      oldValue: null,
      value: this.model.defaultName(),
      options: [],
      dropDownVisible: false,
    }
  },
  created() {
    this.oldValue = this.model._id;
  },
  computed: {
    inputValue: {
      set(value) {
        if (value === this.value) { return }
        if (value === "") {
          this.model._id = undefined;
          return;
        }
        this.fillOptions(value)
        this.value = value;
      },
      get() {
        return this.value;
      }
    },
    dropDownId() {
      return "Dropdown_" + this.model.constructor.getName() + "_" + this._uid;
    },
    state() {
      if (this.oldValue === this.model._id) {
        this.$emit("state", null);
        return null;
      }
      let state = (this.model_id === undefined || this.model_id === null);
      this.$emit("state",state);
      return state;
    }
  },
  methods: {
    toggleDropDown() {
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    onSelectRow(row) {
      this.model._id = row.value;
      this.inputValue = row.text;
      this.toggleDropDown();
    },
    fillOptions(value) {
      self=this;
      if (value.length < 3) {
        this.options = [];
        if (this.dropDownVisible) {
          this.toggleDropDown();
        }
        return;
      }
      this.model.callMethod("searchCityServer",value, I18n.getLanguage(),(err,result) => {
        self.options = result;
        if (result && !this.dropDownVisible) {
          this.toggleDropDown();
        }
        //Only one element left, select it
        if (result && result.length === 1) {
         this.onSelectRow(result[0]);
        }
      })
    }
  },
}
</script>

<style scoped>

</style>