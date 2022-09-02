import {I18n} from "meteor/akyma:bk";
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
    options: Array
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
    this.searchableData = !this.selectInput

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

    optional() {
      if (typeof this.definition.optional === "function")
        return this.definition.optional(this.model)
      else
        return this.definition.optional
    },

    readonly() {
      return this.$props["for"] === "view" || this.plaintext || this.disabled
    },

    subscription() {
      return this.definition.subscription
    },

    meteorMethod() {
      return this.method || this.definition.method
    },

    isArray() {
      return this.definition instanceof ListField
    },
    fieldValue() {
      return this.model[this.field]
    },
    getId() {
      let definition = this.definition
      // Array of relation
      if (this.isArray) {
        if (definition.cache) {
          return this.fieldValue.map(x => x._id)
        } else {
          return this.fieldValue
        }
      // belongs to relation
      } else {
        if (definition.cache && typeof this.fieldValue === "object") {
          return this.fieldValue && this.fieldValue._id
        } else {
          return this.fieldValue
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
      return this.minCharacters === 0 || this.options !== undefined;
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
      if (this.options) return {} // When used as a multi select for Enum
      let definition = this.model.getDefinition(this.field);
      if (!definition.where && this.readonly) {
        return {
          search: {
            _id: {$in: this.getId}
          }
        }
      }
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
        if (value.length >= this.minCharacters && this.minCharacters !== 0) {
          this.activateSubscription(true);
        }
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
        if (this.options) {
          if (this.isArray) {
            return this.options.filter(e => this.getId.includes(e.value)).sort(
              (a,b) => this.getId.indexOf(a.value) - this.getId.indexOf(b.value)
            )
          } else {
            return this.options.find(e => this.getId === e.value)
          }
        }
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
      if (this.options) return
      if (this.isArray)
        return this.model[this.field + "Instances"]();
      else
        return this.model[this.field + "Instance"]();
    },
  },
  watch: {
    where(newValue,oldValue) {
      if (_.isEqual(newValue?.search,oldValue?.search)) return
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
    },
    getId(newValue,oldValue) {
      if (newValue === oldValue) return
      if (!this.subscription) return
      if (this.isArray) return

      let value = this.relationList.find(e => newValue === e.value)

      if (newValue !== this.oldValue && value === undefined)
        this.activateSubscription(!this.readonly)
    }
  },
  methods: {
    setId(id,record) {
      let definition = this.model.getDefinition(this.field)
      // Array of relation
      if (this.isArray) {
        if (_.isEmpty(this.model[this.field])) this.model[this.field] = [] ;
        if (definition.cache) {
          if (!(this.model[this.field].find(e=>e._id === record._id)))
            this.model[this.field].push(record);
        } else {
          if (!(this.model[this.field].includes(id)))
            this.model[this.field].push(id);
        }
      } else {
        if (definition.cache) {
          this.model[this.field] = record
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
      this.$emit("removeAll")
      if (this.isArray)
        this.model[this.field] = []
      else
        this.model[this.field] = undefined

      if (!this.selectInput)
        this.relationList = []
    },
    search(query) {
      this.inputValue = query;
    },
    activateSubscription(allAccessible=true) {
      if (this.readonly && this.emptyId) return
      let oldHandler = this.handler
      this.ready = false
      //let where = (allAccessible) ? this.where : {}
      let where = this.where
      let value = (allAccessible) ? this.value : undefined
      let subscriptionName = this.definition.subscription
      if (subscriptionName) {
        this.handler = Meteor.subscribe(
          subscriptionName,
          this.getId,
          value,
          I18n.getLanguage(),
          where,
          this.readonly
        )

        Tracker.autorun(() => {
          let ready = this.handler.ready();
          if (ready) {
            oldHandler && oldHandler.stop()
            this.populate()
            this.ready = true
            this.$emit("ready")
          }
        })
      } else if (this.meteorMethod) {
        Meteor.call(
          this.meteorMethod,
          this.getId,
          value,
          I18n.getLanguage(),
          where,
          this.readonly,
          (err,result) => {
            if (err)
              this.errorCallback(err,result)
            else {
              this.populate(result)
              this.ready = true
              this.$emit("ready")
            }
          }
        )
      } else {
        this.populate()
        this.ready = true
        this.$emit("ready")
      }

    },
    populate(records) {
      if (this.options) {
        this.relationList = this.options
        return
      }

      this.relationList = this.getOptionsFromRelations(records)
      if (this.relationList.length === 1 && !this.optional) {
        //this.model[this.field] = this.relationList[0].value;
        this.setId(this.relationList[0].value,this.relationList[0].record);
        if (this.selectInput) {
          this.searchableData = false
          this.disabledData = !this.optional
        } else {
          this.$refs.select?.deactivate()
        }
      }

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
            'text': relation.defaultName && relation.defaultName() || relation._id,
            'record': record
          }
        }).sort((a,b) => (a.text <= b.text) ? -1 : 1)

      // else (if subscription or readonly (maybe already subscribed))
      return relationClass && relationClass.find(where.search).map(record => {
        return {
          'value': record._id,
          'text': record.defaultName && record.defaultName() || record._id,
          'record': record.raw()
        }
      }).sort((a,b) => (a.text <= b.text) ? -1 : 1)
    },
    onSelectRow(row) {
      //this.model.set(this.field, row.value, {cast: true})
      this.$emit("select",row)
      this.setId(row.value,row.record)
      this.value = "";
      if (this.relationList.length !== 1 && !this.selectInput)
        this.activateSubscription(true); // since value length is lower than 3
      //this.relationList = [];
      this.model.isValid(this.field);
      this.$emit("input",this.model[this.field])
    },
    onRemoveTag(row) {
      this.$emit("remove",row)
      this.removeId(row.value)
      this.$emit("input",this.model[this.field])
    },
    onRemoveAllTags() {
      if (this.plaintext || this.disabled) return
      this.removeAll()
      this.$emit("input",this.model[this.field])
    },
    allowSearch() {
      const multiselect = this.$refs.select
      if (!multiselect.isOpen) {
        this.searchableData = true
        this.$nextTick(() => multiselect.toggle())
      }
    },
    onOpenDropdown() {

    },
    onCloseDropdown() {
      if (this.selectInput)
        this.searchableData = false
    }
  }
}