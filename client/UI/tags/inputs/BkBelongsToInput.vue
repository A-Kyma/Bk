<template>
  <b-form-select
      v-if="selectInput"
      ref="select"
      v-bind="$attrs"
      v-model="selectValue"
      :options="relationList"
      :state="state"/>

  <div v-else class="col-12 no-padding-left no-padding-right">
    <!-- if we are on the search input -->
    <b-form-input
        v-if="model[field]===undefined"
        v-bind="$attrs"
        v-model="inputValue"
        type="search"
        :state="state"
        @keydown.arrow-up="onKeyUp"
        @keydown.arrow-down="onKeyDown"
    />
    <!-- if we are on the relation defaultName input -->
    <b-form-input
      v-else
      ref="relationInput"
      v-bind="$attrs"
      v-model="inputRelation"
      type="search"
      :state="state"
    />
    <b-collapse :id="dropDownId" class="mt-2">
        <b-table
            v-if="dropDownVisible"
            hover
            borderless
            thead-class="d-none"
            value-td-class="d-none"
            :items="relationList"
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
      handler: undefined,
      relationList: [],
      relationOne: "",
    }
  },
  created() {
    this.oldValue = this.model[this.field];

    if (this.model[this.field] || this.selectInput)
      this.activateSubscription()
  },

  destroyed() {
    this.handler && this.handler.stop();
  },

  computed: {
    selectInput() {
      return this.minCharacters === 0;
    },
    minCharacters() {
      let definition = this.model.getDefinition(this.field)
      if (!definition) return 3
      let min = definition.minCharacters
      if (typeof min === "function") {
        min = min({model: this.model, field: this.field})
      }
      if (min === undefined || min === null || isNaN(min)) return 3
      return min;
    },
    selectValue: {
      set: function (value) {
        if (value === null || value === "") {
          value = undefined
        }
        this.model.set(this.field, value, {cast: true})
        this.model.isValid(this.field);
      },
      get: function () {
        return this.model.get(this.field);
      }
    },
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, relation is removed
        this.model[this.field] = undefined;
        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= this.minCharacters)
          this.activateSubscription();
        // We unsubscribe if subscription exists and if not 3 characters
        if (this.model[this.field] === undefined && value.length < this.minCharacters) {
          this.handler && this.handler.stop();
          this.hideDropDown();
          this.relationList = [];
        }
      },
      get() {
        return this.value;
      }
    },
    inputRelation: {
      set(value) {
        let defaultName = this.relation && this.relation.defaultName()
        if (value === defaultName) return
        if (value.startsWith(defaultName)) {
          this.inputRelation = defaultName;
          return
        }
        if (!value || value !== defaultName) {
          this.value = ""
          // unset field and check validation if empty
          this.model.set(this.field);
          this.model.isValid(this.field);
          // Stop subscription
          this.handler && this.handler.stop()
        }
      },
      get() {
        return this.relationOne;
      }
    },
    relation() {
      return this.model[this.field + "Instance"]();
    },
    dropDownId() {
      return "Dropdown_" + this.field + "_" + this._uid;
    },
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
    },
  },
  methods: {
    activateSubscription() {
      let oldHandler = this.handler;

      let subscriptionName = this.model.getDefinition(this.field).subscription || this.field + ".search"
      this.handler = Meteor.subscribe(
          subscriptionName,
          this.model[this.field], this.value, I18n.getLanguage()
      )

      Tracker.autorun(() => {
        let ready = this.handler.ready();
        if (ready) {
          oldHandler && oldHandler.stop()
          this.populate()
        }
      })

    },

    populate() {
      if (this.selectInput) {
        this.relationList = this.getOptionsFromRelations()
        if (this.relationList.length === 1) {
          this.model[this.field] = this.relationList[0].value;
          this.$refs.select.$el.disabled = true
        }
        return
      }
      if (this.model[this.field]) {
        let relation = this.model[this.field + "Instance"]();
        this.relationOne = relation && relation.defaultName();
        return
      }
      this.relationList = this.getOptionsFromRelations()
      if (this.relationList.length === 1) {
        this.onSelectRow(this.relationList[0])
        this.populate()
        return
      }
      this.showDropDown();
    },
    getOptionsFromRelations() {
      let definition = this.model.getDefinition(this.field);
      let relationClass = definition.relation;
      let where = definition.where(null, this.value, I18n.getLanguage())
      if (!where) return;
      return relationClass && relationClass.find(where.search).map(record => {
        return {
          'value': record._id,
          'text': record.defaultName()
        }
      });
    },
    showDropDown() {
      if (this.dropDownVisible) return;
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    hideDropDown() {
      if (!this.dropDownVisible) return;
      this.$root.$emit('bv::toggle::collapse', this.dropDownId)
      this.dropDownVisible = !this.dropDownVisible;
    },
    // If collapse appears and we hit down arrow, we select first element
    onKeyDown(e) {
      if (!this.dropDownVisible) return;
      this.$refs.selectableTable.$el.getElementsByTagName("tr")[1].focus();
    },
    // If collapse appears and we hit up arrow, we select last element
    onKeyUp(e) {
      if (!this.dropDownVisible) return;
      let elements = this.$refs.selectableTable.$el.getElementsByTagName("tr");
      elements[elements.length-1].focus();
    },
    // When we click on row or hit enter when selected
    onSelectRow(row) {
      this.model.set(this.field, row.value, {cast: true})
      this.value = "";
      if (this.relationList.length !== 1)
        this.activateSubscription(); // since value length is lower than 3
      this.hideDropDown();
      this.model.isValid(this.field);
    },
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