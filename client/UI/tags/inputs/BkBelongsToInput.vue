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
      @keydown="onKeyDownRelation"
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
    let fieldDefinition = this.model.getDefinition(this.field)
    this.oldValue = this.getId

    if (this.oldValue || this.selectInput)
      this.activateSubscription()
  },

  destroyed() {
    this.handler && this.handler.stop();
  },

  computed: {
    definition() {
      return this.model.getDefinition(this.field)
    },
    getId() {
      let definition = this.definition
      if (definition.cache && typeof this.model[this.field] === "object") {
        return this.model[this.field] && this.model[this.field]._id
      } else {
        return this.model[this.field]
      }
    },
    selectInput() {
      return this.minCharacters === 0;
    },
    minCharacters() {
      let definition = this.definition
      if (!definition) return 3
      let min = definition.minCharacters
      if (typeof min === "function") {
        min = min({model: this.model, field: this.field})
      }
      if (min === undefined || min === null || isNaN(min)) return 3
      return min;
    },
    where() {
      let definition = this.definition
      let where = definition.where.call(
          this.model, // set this in where function to this.model
          this.getId, this.value, I18n.getLanguage()
      ) //TODO where not found
      if (!where) return;
      if (!where.search && !where.param) where = { search: where }
      return where
    },
    selectValue: {
      set: function (value) {
        if (value === null || value === "") {
          value = undefined
        }
        // TODO: manage cached object
        this.setId(value)
        //this.model.set(this.field, value, {cast: true})
        //this.model.isValid(this.field);
      },
      get: function () {
        return this.model.get(this.field);
      }
    },
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, relation is removed
        this.setId()
        //this.model[this.field] = undefined;

        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= this.minCharacters)
          this.activateSubscription();
        // We unsubscribe if subscription exists and if not 3 characters
        if (this.getId === undefined && value.length < this.minCharacters) {
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
          this.setId()
          //this.model.set(this.field);
          //this.model.isValid(this.field);
          // Stop subscription
          this.handler && this.handler.stop()
        }
      },
      get() {
        // We are on an issue where this.model[this.field] is not an ID
        if (this.relationOne === "" || this.relationOne === undefined)
          return this.model[this.field]
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
        if (_.isEqual(this.getId, this.oldValue) || !this._isMounted) {
          this.$emit("state", null)
          return null
        } else {
          this.$emit("state", true)
          return true
        }
      }
    },
  },
  watch: {
    // Used if model value updated outside of this component
    getId(newValue, oldValue) {
      if (newValue === undefined) return
      let definition = this.definition
      if (definition.cache) {
        if (newValue && newValue._id === oldValue && oldValue._id) return
      } else {
        if (newValue === oldValue) return
      }

      this.activateSubscription()
    }
  },
  methods: {
    setId(id) {
      let definition = this.definition
      if (definition.cache) {
        if (this.model[this.field] && this.model[this.field]._id === id)
          return
        this.$emit("input",{_id: id})
        //this.model[this.field] = { _id: id }
      } else {
        if (this.model[this.field] !== id)
          this.$emit("input",id)
        //this.model[this.field] = id
      }
    },
    activateSubscription() {
      let oldHandler = this.handler;

      let subscriptionName = this.definition.subscription || this.field + ".search"
      this.handler = Meteor.subscribe(
          subscriptionName,
          this.getId, this.value, I18n.getLanguage(),
          this.where
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
      let definition = this.definition
      if (this.selectInput) {
        this.relationList = this.getOptionsFromRelations()
        if (this.relationList.length === 1 && !definition.optional) {
          //this.model[this.field] = this.relationList[0].value;
          this.setId(this.relationList[0].value);
          this.$refs.select.$el.disabled = true
        }
        return
      }
      if (this.getId) {
        let relation = this.model[this.field + "Instance"]();
        this.relationOne = relation && relation.defaultName();
        return
      }
      this.relationList = this.getOptionsFromRelations()
      if (this.relationList.length === 1 && !definition.optional) {
        this.onSelectRow(this.relationList[0])
        this.populate()
        return
      }
      this.showDropDown();
    },
    getOptionsFromRelations() {
      let definition = this.definition
      let relationClass = definition.relation;
      let where = this.where
      if (!where) return;
      let result = relationClass && relationClass.find(where.search).map(record => {
        return {
          value: record._id,
          text: record.defaultName()
        }
      });
      if (definition.optional && Array.isArray(result)) {
        result.unshift({
          value: undefined,
          text: " "
        })
      }
      return result
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
    // Prevent typing anything when City chosen
    onKeyDownRelation(e) {
      let defaultName = this.relation && this.relation.defaultName();
      if (e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab")
        e.preventDefault()
      if (e.key === "Backspace") {
        this.value = ""
        this.setId()
      }
    },
    // When we click on row or hit enter when selected
    onSelectRow(row) {
      //this.model.set(this.field, row.value, {cast: true})
      this.setId(row.value)
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