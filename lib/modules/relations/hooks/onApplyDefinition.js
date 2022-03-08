import {Class as AstroClass} from "meteor/jagi:astronomy";
import _each from 'lodash/each';



function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition,function(fieldDefinition,fieldName) {

    function available() { return undefined };

    function instanciate() {
      if (this[fieldName]) {
        if (fieldDefinition.cache || typeof this[fieldName] === "object") {
          let id = this[fieldName] && this[fieldName]._id
          let result = fieldDefinition.relation.findOne(id);
          if (result) return result
          return new (fieldDefinition.relation) (this[fieldName])
        } else {
          let result = fieldDefinition.relation.findOne(this[fieldName])
          if (result) return result
          return new (fieldDefinition.relation) ({_id: this[fieldName]})
        }
      } else {
        return new (fieldDefinition.relation) ();
      }
    }

    function localInstanciate() {
      if (fieldDefinition.cache && this[fieldName] && typeof(this[fieldName]) === "object") {
        return new (fieldDefinition.relation) (this[fieldName])
      }
    }

    function instanciates() {
      if (this[fieldName] && Array.isArray(this[fieldName])) {
        let ids;

        if (fieldDefinition.cache) {
          ids = this[fieldName].map(x=>x._id)
          return fieldDefinition.relation.find(ids)
        } else {
          ids = this[fieldName].map(x=>{
            if (typeof x === "object") return x._id
            return x
          })
        }
        let uniqueSet = new Set(ids)
        ids = [...uniqueSet]
        let result = fieldDefinition.relation.find({_id: {$in:ids}});
        if (result.count() !== ids.length) {
          return this[fieldName].map(x=>new (fieldDefinition.relation) (x))
        } else {
          return result
        }

      } else {
        return [new (fieldDefinition.relation) ()];
      }
    }

    function localInstanciates() {
      if (fieldDefinition.cache && this[fieldName] && Array.isArray(this[fieldName])) {
        return this[fieldName].map(x=>new (fieldDefinition.relation) (x))
      }
    }

    // if (!fieldDefinition.cache) {
      Class.extend({
        fields: {
          [fieldName]: fieldDefinition
        }
      })
    // }

    if (Array.isArray(fieldDefinition.type)) {
      // has_many relation
      Class.extend({
        helpers: {
          [fieldName + "Available"]: available,
          [fieldName + "Instances"]: instanciates,
        }
      })
    } else {
      // belongs_to relation
      Class.extend({
        helpers: {
          [fieldName + "Available"]: available,
          [fieldName + "Instance"]: instanciate,
        }
      })
    }

    if (fieldDefinition.cache) {
      if (Array.isArray(fieldDefinition.type)) {
        Class.extend({
          helpers: {
            [fieldName + "LocalInstances"]: localInstanciates,
          }
        })
      } else {
        Class.extend({
          helpers: {
            [fieldName + "LocalInstance"]: localInstanciate,
          }
        })
      }
    }

    // Add events on Meteor server side, adding the full relation object in parent collection
    if (Meteor.isServer) {
      if (fieldDefinition.cache) {
        if (Array.isArray(fieldDefinition.type)) {
          // TODO
          Class.extend({
            events: {
              beforeSave(e) {
                let doc = e.currentTarget
                let ids = doc[fieldName] && doc[fieldName].map(x=>x._id)
                if (ids) {
                  let relations = fieldDefinition.relation.getCollection().find({_id: {$in: ids}})
                  if (relations) {
                    doc[fieldName] = relations.fetch()
                  }
                }
              }
            }
          })
        } else {
          Class.extend({
            events: {
              beforeSave(e) {
                let doc = e.currentTarget
                let id = doc[fieldName] && doc[fieldName]._id
                if (id) {
                  let relation = fieldDefinition.relation.getCollection().findOne(id)
                  if (relation) {
                    doc[fieldName] = relation
                  }
                }
              }
            }
          })
        }
      }
    }
  })
}

export default onApplyDefinition;