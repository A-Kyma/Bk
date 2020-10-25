<template>
  <div>
    <b-form-input
        v-bind="$attrs"
        v-model="inputValue"
        type="search"
        :state="state"
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
import {_} from "lodash";

export default {
  name: "BkBelongsToInput",
  props: {
    model: Class,
    field: String,
  },
  data() {
    return {
      oldValue: null,
      value: this.model[this.field].defaultName(),
      options: [],
      dropDownVisible: false,
      relation: this.model[this.field]
    }
  },
  created() {
    this.oldValue = this.relation._id;
  },
  computed: {
    inputValue: {
      set(value) {
        if (value === this.value) {
          return
        }
        if (value === "") {
          this.relation._id = undefined;
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
      return "Dropdown_" + this.relation.constructor.getName() + "_" + this._uid;
    }
  },
  meteor: {
    state() {
      // Similar has management found in BkInnerInput but value checked is relation_id
      let errors = this.model.getError(this.field);
      if (errors) {
        this.$emit("validationError", errors.map((value, key) => value.message).join('<br/>'))
        this.$emit("state", false);
        return false
      } else {
        if (_.isEqual(this.relation._id, this.oldValue) || !this._isMounted) {
          this.$emit("state", null)
          return null
        } else {
          this.$emit("state", true)
          return true
        }
      }
    }
  },
  methods: {
    toggleDropDown() {
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    onSelectRow(row) {
      this.relation._id = row.value;
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

      // Todo: we will have a more generic way to call external relation method
      this.relation.callMethod("searchCityServer",value, I18n.getLanguage(),(err,result) => {
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