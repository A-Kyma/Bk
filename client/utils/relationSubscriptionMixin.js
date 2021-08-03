import {I18n} from "meteor/a-kyma:bk";
import {_} from "lodash";
import {Class, ValidationError, ScalarField, ObjectField, ListField, Union} from 'meteor/jagi:astronomy';


export default {
  props: {
    model: Class,
    field: String,
  },
  data() {
    return {
      oldValue: null,
      value: undefined,
      handler: undefined,
      ready: true,
      relationList: [],
      relationOne: "",
    }
  },

  created() {
    this.oldValue = this.getId

    if (!_.isEmpty(this.oldValue) || this.selectInput)
      this.activateSubscription()
  },
  destroyed() {
    this.handler && this.handler.stop();
  },

  computed: {
    definition() {
      return this.model.getDefinition(this.field)
    },
    isArray() {
      return this.definition instanceof ListField
    },
    getId() {
      let definition = this.definition
      // Array of relation
      if (this.isArray) {
        if (definition.cache) {
          return this.model[this.field].map(x => x._id)
        } else {
          return this.model[this.field]
        }
      // belongs to relation
      } else {
        if (definition.cache && typeof this.model[this.field] === "object") {
          return this.model[this.field] && this.model[this.field]._id
        } else {
          return this.model[this.field]
        }
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
    relation() {
      return this.model[this.field + "Instance"]();
    },
    relations() {
      return this.model[this.field + "Instances"]();
    },
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, relation is removed
        //this.model[this.field] = undefined;
        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= this.minCharacters)
          this.activateSubscription();
        // We unsubscribe if subscription exists and if not 3 characters
        if (_.isEmpty(this.getId) && value.length < this.minCharacters) {
          this.handler && this.handler.stop();
          // this.hideDropDown();
          this.relationList = [];
        }
      },
      get() {
        return this.value;
      }
    },
    inputRelation: {
      set(value) {
        return
        /*
        this.value = value
        this.model[this.field] = value
        return

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
         */
      },
      get() {
        if (_.isEmpty(this.model[this.field])) return
        if (this.isArray) {
          return this.relations.map(e => { return { value: e._id, text: e.defaultName() }})
        } else {
          return { value: this.relation._id, text: this.relation.defaultName() }
        }
      },
    }
  },

  methods: {
    setId(id) {
      let definition = this.model.getDefinition(this.field)
      // Array of relation
      if (this.isArray) {
        if (_.isEmpty(this.model[this.field])) this.model[this.field] = [] ;
        if (definition.cache) {
          this.model[this.field].push({_id: id});
        } else {
          this.model[this.field].push(id);
        }
      } else {
        if (definition.cache) {
          this.model[this.field] = {_id: id}
        } else {
          this.model[this.field] = id
        }
      }
    },
    removeId(id) {
      let definition = this.model.getDefinition(this.field)
      if (_.isEmpty(this.model[this.field])) return
      // Array of relation
      if (this.isArray) {
        if (definition.cache) {
          this.model[this.field] = this.model[this.field].filter(e => e._id !== id)
        } else {
          this.model[this.field] = this.model[this.field].filter(e => e !== id)
        }
      } else {
        if (definition.cache) {
          if (this.model[this.field]._id !== id)
            this.model[this.field] = undefined
        } else {
          if (this.model[this.field] !== id)
          this.model[this.field] = undefined
        }
      }
    },
    search(query) {
      this.inputValue = query;
    },
    activateSubscription() {
      let oldHandler = this.handler
      this.ready = false
      let subscriptionName = this.definition.subscription || this.field + ".search"
      this.handler = Meteor.subscribe(
        subscriptionName,
        this.getId, this.value, I18n.getLanguage()
      )

      Tracker.autorun(() => {
        let ready = this.handler.ready();
        if (ready) {
          this.ready = true
          oldHandler && oldHandler.stop()
          this.populate()
        }
      })

    },
    populate() {
      if (this.selectInput) {
        this.relationList = this.getOptionsFromRelations()
        if (this.relationList.length === 1) {
          //this.model[this.field] = this.relationList[0].value;
          this.setId(this.relationList[0].value);
          this.$refs.select.$el.disabled = true
        }
        return
      }
      /*
      if (!_.isEmpty(this.getId)) {
        let relation = this.model[this.field + "Instance"]();
        this.relationOne = relation && relation.defaultName();
        return
      }
      */
      this.relationList = this.getOptionsFromRelations()
      /*
      if (this.relationList.length === 1) {
        this.onSelectRow(this.relationList[0])
        this.populate()
        return
      }
       */
    },
    getOptionsFromRelations() {
      let definition = this.model.getDefinition(this.field);
      let relationClass = definition.relation;
      let where = definition.where(this.getId, this.value, I18n.getLanguage()) //TODO where not found
      if (!where) return;
      return relationClass && relationClass.find(where.search).map(record => {
        return {
          'value': record._id,
          'text': record.defaultName()
        }
      });
    },
    onSelectRow(row) {
      //this.model.set(this.field, row.value, {cast: true})
      this.setId(row.value)
      this.value = "";
      if (this.relationList.length !== 1)
        this.activateSubscription(); // since value length is lower than 3
      //this.relationList = [];
      this.model.isValid(this.field);
    },
    onRemoveTag(row) {
      this.removeId(row.value)
    }
  }
}