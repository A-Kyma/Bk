<template>
  <div class="col-12 no-padding-left no-padding-right">
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
            :items="getOptionsFromRelations"
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
    }
  },
  created() {
    this.oldValue = this.model[this.field];

    if (this.model[this.field])
      this.activateSubscription()
  },

  destroyed() {
    this.handler && this.handler.stop();
  },

  computed: {
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, city is removed
        this.model[this.field] = undefined;
        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= 3)
          this.activateSubscription();
        // We unsubscribe if subscription exists if not 3 characters
        if (this.model[this.field]=== undefined && value.length<3) {
          this.$data.handler && this.$data.handler.stop();
          //this.$data.handler = undefined;
        }
      },
      get() {
        return this.value;
      }
    },
    inputRelation: {
      set(value) {
        if (!value
        || value !== this.relation.defaultName()) {
          this.value = ""
          this.model[this.field] = undefined;

          // Stop subscription
          this.$data.handler && this.$data.handler.stop()
          //this.$data.handler = undefined;
        }
      },
      get() {
        self=this;
        // We force VueJS to use Meteor reactivity for findOne and I18n
        // And so, autorun is also called when subscription changed
        return this.$autorun(() => {
          let relation = self.model[self.field + "Instance"]();
          return relation && relation.defaultName();
        })
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
    },
    getOptionsFromRelations() {
      let relationClass = this.relationClass();
      /***
       * TODO: Probably needed to use the where clause in this find
       * to prevent having other document from other subscription
       ***/
      let cursor = relationClass && relationClass.find();
      if (this.model[this.field]) return;

      // Dropdown invisible if nothing to show
      if ((!cursor || cursor.count() === 0) && this.dropDownVisible) {
        this.toggleDropDown();
      }

      // Dropdown visible if something retrieved
      if (cursor && cursor.count() > 1 && !this.dropDownVisible) {
        this.toggleDropDown();
      }

      let result = cursor && cursor.map(record => {
        return {
          'value': record._id,
          'text': record.defaultName()
        }
      });

      // Dropdown value selected if only one record returned
      if (result && result.length === 1 && this.dropDownVisible) {
        this.onSelectRow(result[0]);
      }

      return result;
    }
  },
  methods: {
    activateSubscription() {
      let oldHandler = this.handler;
      self=this;
      // TODO: adapt the name of subscription
      this.$data.handler = Meteor.subscribe(
          "city.search",
          self.model[self.field], self.value, I18n.getLanguage()
      )
      this.$autorun(() => {
        let ready = self.$data.handler && self.$data.handler.ready();
        if (ready) oldHandler && oldHandler.stop()
      })
    },
    relationClass() {
      let definition = this.model.getDefinition(this.field);
      return definition.relation;
    },
    toggleDropDown() {
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
      self=this;
      this.model.set(this.field, row.value, {cast: true})
      this.value = "";
      this.activateSubscription(); // since value length is lower than 3
      if (this.dropDownVisible) this.toggleDropDown();
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