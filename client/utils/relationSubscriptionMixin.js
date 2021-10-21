import {I18n} from "meteor/a-kyma:bk";
import {_} from "lodash";
import {Class, ValidationError, ScalarField, ObjectField, ListField, Union} from 'meteor/jagi:astronomy';
import errorPopupMixin from "./errorPopupMixin";

export default {
  props: {
    model: Class,
    field: String,
    for: String,
    plaintext: Boolean,
    disabled: Boolean,
    method: String,
  },
  mixins: [errorPopupMixin],
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
      this.activateSubscription(!this.readonly)
  },
  destroyed() {
    this.handler && this.handler.stop();
  },

  computed: {
    definition() {
      return this.model.getDefinition(this.field)
    },

    readonly() {
      return this.$props["for"] === "view" || this.plaintext || this.disabled
    },

    meteorMethod() {
      return this.method || this.definition.method
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
    emptyId() {
      let id = this.getId
      if (id === undefined) return true
      if (Array.isArray(id) && id.length === 0) return true
      if (typeof id === "string" && id.length === 0) return true
      return false
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
      let definition = this.model.getDefinition(this.field);
      let where = definition.where.call(
        this.model, // set this in where function to this.model
        this.getId, this.value, I18n.getLanguage(),
      ) //TODO where not found
      if (!where) return;
      if (!where.search && !where.param) where = { search: where }
      return where
    },
    inputValue: {
      set(value) {
        if (value === this.value) return;

        // If we change from screen, relation is removed
        //this.model[this.field] = undefined;
        this.value = value;

        // We subscribe if at least 3 characters
        if (value.length >= this.minCharacters && this.minCharacters !== 0)
          this.activateSubscription(true);
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
        if (this.emptyId) return
        if (this.isArray) {
          return this.relationList.filter(e => this.getId.includes(e.value))
          //return this.relations.map(e => { return { value: e._id, text: e.defaultName() }})
        } else {
          return this.relationList.find(e => this.getId === e.value)
          //return { value: this.relation._id, text: this.relation.defaultName() }
        }
      },
    },
    viewInputRelation() {
      let relations = this.inputRelation
      if (!relations) return ""
      if (this.isArray)
        return relations.map(elem => elem.text).join(", ")
      else
        return relations.text
    }
  },
  meteor: {
    relation() {
      return this.relations;
    },
    relations() {
      if (this.isArray)
        return this.model[this.field + "Instances"]();
      else
        return this.model[this.field + "Instance"]();
    },
  },
  watch: {
    where(newValue,oldValue) {
      if (_.isEqual(newValue.search,oldValue.search)) return
      let subscriptionName = this.definition.subscription
      if (!subscriptionName && this.selectInput) {
        // if where clause change, repopulate the list
        this.populate();

      }
    },
    relationList(newValue,oldValue) {
      let subscriptionName = this.definition.subscription
      if (!subscriptionName && this.selectInput && Array.isArray(oldValue)) {
        // We remove ids from this.model[this.field] if not in list anymore
        oldValue.forEach(e => {
          let elem = newValue.find(n => n.value === e.value)
          if (!elem) this.removeId(e.value)
        })
      }
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
          if (this.model[this.field]._id === id)
            this.model[this.field] = undefined
        } else {
          if (this.model[this.field] === id)
            this.model[this.field] = undefined
        }
      }
    },
    removeAll() {
      let definition = this.model.getDefinition(this.field)
      if (_.isEmpty(this.model[this.field])) return
      // Array of relation
      if (this.isArray)
        this.model[this.field] = []
      else
        this.model[this.field] = undefined
    },
    search(query) {
      this.inputValue = query;
    },
    activateSubscription(allAccessible=true) {
      if (this.readonly && this.emptyId) return
      let oldHandler = this.handler
      this.ready = false
      let where = (allAccessible) ? this.where : {}
      let value = (allAccessible) ? this.value : undefined
      let subscriptionName = this.definition.subscription
      if (subscriptionName) {
        this.handler = Meteor.subscribe(
          subscriptionName,
          this.getId,
          value,
          I18n.getLanguage(),
          where
        )

        Tracker.autorun(() => {
          let ready = this.handler.ready();
          if (ready) {
            this.ready = true
            oldHandler && oldHandler.stop()
            this.populate()
          }
        })
      } else if (this.meteorMethod) {
        Meteor.call(
          this.meteorMethod,
          this.getId,
          value,
          I18n.getLanguage(),
          where,
          (err,result) => {
            if (err)
              this.errorCallback(err,result)
            else {
              this.populate(result)
              this.ready = true
            }
          }
        )
      } else {
        this.populate()
        this.ready = true
      }

    },
    populate(records) {
      if (this.selectInput) {
        this.relationList = this.getOptionsFromRelations(records)
        if (this.relationList.length === 1 && !this.definition.optional) {
          //this.model[this.field] = this.relationList[0].value;
          this.setId(this.relationList[0].value);
          if (this.$refs.select) this.$refs.select.$el.disabled = true
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
      this.relationList = this.getOptionsFromRelations(result)
      /*
      if (this.relationList.length === 1) {
        this.onSelectRow(this.relationList[0])
        this.populate()
        return
      }
       */
    },
    getOptionsFromRelations(records) {
      let definition = this.model.getDefinition(this.field);
      let relationClass = definition.relation;
      let where = this.where
      if (!where && !records) return;
      if (records)
        return records.map(record => {
          let relation = new relationClass(record)
          return {
            'value': relation._id,
            'text': relation.defaultName && relation.defaultName() || relation._id
          }
        }).sort((a,b) => (a.text <= b.text) ? -1 : 1)

      return relationClass && relationClass.find(where.search).map(record => {
        return {
          'value': record._id,
          'text': record.defaultName && record.defaultName() || record._id
        }
      }).sort((a,b) => (a.text <= b.text) ? -1 : 1)
    },
    onSelectRow(row) {
      //this.model.set(this.field, row.value, {cast: true})
      this.setId(row.value)
      this.value = "";
      if (this.relationList.length !== 1)
        this.activateSubscription(false); // since value length is lower than 3
      //this.relationList = [];
      this.model.isValid(this.field);
      this.$emit("input",this.model[this.field])
    },
    onRemoveTag(row) {
      this.removeId(row.value)
      this.$emit("input",this.model[this.field])
    },
    onRemoveAllTags() {
      if (this.plaintext || this.disabled) return
      this.removeAll()
      this.$emit("input",this.model[this.field])
    }
  }
}