<template>
  <div class="col-12 no-padding-left no-padding-right">
    <b-form-input
        v-bind="$attrs"
        v-model="inputValue"
        type="search"
        :state="state"
        @keydown.arrow-down="onKeyDown"
    />
    <b-collapse :id="dropDownId" class="mt-2">
      <b-table
          hover
          borderless
          thead-class="d-none"
          value-td-class="d-none"
          :items="options"
          :fields='["value","text"]'
          selectable
          select-mode="single"
          ref="selectableTable"
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
      value: undefined,
      options: [],
      dropDownVisible: false,
    }
  },
  created() {
    this.oldValue = this.model[this.field];
    this.value = this.relation.defaultName();
  },
  computed: {
    inputValue: {
      set(value) {
        if (value === this.value) {
          return
        }

        // If we change from screen, city is removed
        this.model[this.field] = undefined;

        this.fillOptions(value)
        this.value = value;
      },
      get() {
        return this.value;
      }
    },
    relation() {
      return this.model[this.field + "Instance"]();
    },
    dropDownId() {
      return "Dropdown_" + this.field + "_" + this._uid;
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
        if (_.isEqual(this.model[this.field], this.oldValue) || !this._isMounted) {
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
    onKeyDown(e) {
      if (!this.dropDownVisible) return;
      this.$refs.selectableTable.$el.getElementsByTagName("tr")[1].focus();
      //this.$refs.selectableTable.selectRow(0);
    },
    onSelectRow(row) {
      this.model.set(this.field, row.value, {cast: true})
      this.value = row.text;
      if (this.dropDownVisible) this.toggleDropDown();
      this.model.isValid(this.field);
    },
    fillOptions(value) {
      self=this;
      if (value.length < 3) {
        this.options = [];
        if (this.dropDownVisible) this.toggleDropDown();
        return;
      }

      // Avoid calling back-end if City already selected
      if (self.model[self.field] !== undefined) return;

      // Todo: we will have a more generic way to call external relation method
      let definition = this.model.getDefinition(this.field);
      let relation = new (definition.relation)({_id: this.model[this.field]})
      relation.callMethod("searchCityServer",value, I18n.getLanguage(),(err,result) => {
        self.options = result;
        if (result && !this.dropDownVisible && result.length !== 1) {
          self.toggleDropDown();
        }
        // Only one element left, select it
        // Avoid also to call 2 times onSelectRow while only one result left
        if (result && result.length === 1
        && self.model[self.field] === undefined) {
         self.onSelectRow(result[0]);
        }
      })
    }
  },
}
</script>

<style scoped>
  .no-padding-left {
    padding-left: 0px !important;
  }
  .no-padding-right {
    padding-right: 0px !important;
  }
</style>