/***
 * Lifecycle can be created using this pattern:
const Status = Lifecycle.create({
	name: "Status",
	states: {
		draft: { variant: "secondary" },
		validated: { variant: "info" }
	},
	default: "draft", // Default value when nothing set
	transitions: {
		validate: {
		  from: "draft", // from status, need to exists in status
		  to: "validated", // to status, need to exists in status
		  roles: ["Normal","Administrator"], // Roles available using Bk Role
		  icon: "check2-circle", // here, it's a Bootstrap-Vue icon
		  variant: "info", // variant for the button
		  class: "", // class to give to the button
		  animation: "", // icon animation
		  fields: ["validationComment"], // Fields to ask to go to next step
		  condition: function(args) { args.doc.get(args.name) === "blabla" }
		},
	}
})
 * where doc = current instanciated model
 ***/

import _zipObject from 'lodash/zipObject';
import _range from 'lodash/range';
import _forOwn from 'lodash/forOwn';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _values from 'lodash/values';
import _keys from 'lodash/keys';
import _indexOf from 'lodash/indexOf';
import _filter from 'lodash/filter';
import _pickBy from 'lodash/pickBy';
import _each from 'lodash/each';
import _has from 'lodash/has';
import _includes from "lodash/includes";
import { Type, Validators, Class } from 'meteor/jagi:astronomy';
import { check, Match } from 'meteor/check';
import Role from "../../../classes/role";
import Enum from "./Enum";

const isAstroClass = Match.Where((x) => Class.includes(x))
const isAstroClassInstance = Match.Where((x) => x && Class.includes(x.constructor))

const lifecycleDefinitionPattern = {
  name: String,
  states: Match.Where((x) => {
    check(x, Object);
    _each(x,(value,key) => {
      check(key,String);
      check(value,{variant: String});
    })
    return true;
  }),
  default: String,
  transitions: Match.Where((x) => {
    check(x, Object);
    _each(x,(value,key) => {
      check(key,String);
      check(value, {
        label: Match.Maybe(String),
        alt: Match.Maybe(String),
        from: String,
        to: String,
        roles: Match.Optional(Match.OneOf(Array,String)),
        icon: String,
        variant: String,
        fields: Match.Maybe(Match.OneOf(Array,String)),
        class: Match.Maybe(String),
        animation: Match.Maybe(String),
        condition: Match.Where((y) => {
          return typeof(y) === "function"
        })
      })
    })
    return true;
  })
};

class Lifecycle {
  // private fields
  #value;
  #oldValue;
  /***
   * Create a new Lifecycle constructor.
   * @param {String} state - a state defined in the Lifecycle
   * @returns value of the current state
   * @constructor
   */
  constructor(state) {
    // Simply return the state value
    const doc = this;
    const Lifecycle = doc.constructor;
    if (state === undefined) this.#value = Lifecycle.getDefault();
    else this.#value = Lifecycle[state];
    this.#oldValue = this.#value;

    // Create transitions
    let transitions = Lifecycle.getTransitions()
    for (let transition in transitions) {
      if (transitions.hasOwnProperty(transition)) {
        this[transition] = () => {
          this.#value = transitions[transition].to;
        }
      }
    }
  };

  get value() {
    return this.#value
  }

  get label() {
    return this.constructor.getLabelKey(this.value)
  }

  // Contains list of Lifecycles
  static has(lifecycleName) {
    return _has(this.lifecycles, lifecycleName);
  }

  static includes(Lifecycle) {
    return _includes(this.lifecycles, Lifecycle);
  }
  // Create a new Lifecycle
  static create(definition) {

    // Check lifecycle pattern
    check(definition, lifecycleDefinitionPattern);

    // Get states
    let states = _keys(definition.states);

    // Check default value - has to be in states
    check(definition.default,Match.Where((x) => {
      return states.includes(x);
    }));
    let defaultState = definition.default;

    // get transitions:
    let transitions = _keys(definition.transitions);

    // get { from: [ transition1, transition2 ] } Object
    let availableTransitions = {};
    _each(transitions, (transitionDefinition, transition) => {
      let from = transitionDefinition.from;
      if (availableTransitions[from] === undefined) availableTransitions[from]=[];
      availableTransitions[from].push(transition);
    });

    // get { to: [ transition1, transition2] }
    let comingTransitions = {};
    _each(transitions, (transitionDefinition, transition) => {
      let to = transitionDefinition.to
      if (comingTransitions[to] === undefined) comingTransitions[to]=[];
      comingTransitions[to].push(transition);
    });

    Lifecycle.getName = function() {
      return definition.name;
    };

    Lifecycle.getClassName = function() {
      return "Lifecycle"
    }

    // Lifecycle.name = "Lifecycle"

    Lifecycle.getDefault = function() {
      return defaultState;
    }

    Lifecycle.getStates = function() {
        return states;
    };

    Lifecycle.getState = function(state) {
      check(state,String);
      return definition.states[state] || {};
    }

    Lifecycle.getLabelKey = function(state) {
      return "Lifecycle." + Lifecycle.getName() + ".State." + state + ".label";
    }

    // Return Enum class
    Lifecycle.getEnum = function() {
      let EnumClass = Enum.enums[Lifecycle.getName() + "Filter"]
      if (EnumClass) return EnumClass

      EnumClass = Enum.create({
        name: Lifecycle.getName() + "Filter",
        identifiers: Lifecycle.getStates()
      })

      EnumClass.getLabelKey = function(state) {
        return "Lifecycle." + Lifecycle.getName() + ".State." + state + ".label";
      }
      return EnumClass
    }

    Lifecycle.getStateVariant = function(state) {
      check(state,String);
      return definition.states[state] && definition.states[state].variant;
    }

    Lifecycle.getTransition = function(transition) {
      return definition.transitions[transition];
    };

    Lifecycle.getTransitions = function() {
      return definition.transitions;
    };

    Lifecycle.getAvailableTransitions = function(from) {
      return availableTransitions[from] || [];
    };

    /***
     * @description retrieve transitions for specific role
     * @param {String} from: status from
     * @param {String} role: role of the user or left undefined
     * @param {String} field: field of the concerned model
     * @param {String} [to]: status to (optional)
     * @return {Array} list of transitions available
     */
    Lifecycle.getTransitionsForRole = function(from,role,field,to) {
      check(from,String);
      check(role,Match.Maybe(String));
      check(field,String);
      let result=[];

      let transitionValid = function(t) {
        // if from is not the same, check next transition
        if (t.from !== from) return false;
        if (to && t.to !== to) return false;

        // if no role asked, transition available
        if (Match.test(t.roles,undefined) || t.roles === []) {
          return true;
        }

        // if role in the list of roles, transition available
        if (Match.test(t.roles,Array)) {
          return t.roles.includes(role)
        }

        // if role matches roles, transition available
        if (Match.test(t.roles,String)) {
          if (role === undefined) return t.roles === ""
          return t.roles === role
        }
        return false;
      }

      //return _pickBy(Lifecycle.getTransitions(), transitionValid(t))
      let transitions = Lifecycle.getTransitions()
      for (let step in transitions) {
        let transition = transitions[step]
        if (transitionValid(transition)) {
          transition.field=field
          result.push(transition)
        }
      }
      return result
    }

    /***
     * @description retrieve transitions for specified model
     * @param {AstroClass} model
     * @param {String} field: field of lifecycle
     * @return {Array} list of transitions available
     */
    Lifecycle.getTransitionsForModel = function(model,field) {
      check(model,isAstroClassInstance);
      check(field,String);
      let from = model.get(field)
      let role = Role.check(model)
      return Lifecycle.getTransitionsForRole(from, role, field)
    }

    /***
     * @description Used for validators. Say if transition is authorized
     * @param {AstroClass} model
     * @param {String} field - field of the model where the lifecycle is
     * @param {String} from - Transition start
     * @param {String} to - Transition end
     */
    Lifecycle.isAuthorized = function(model,field,from,to) {
      check(model,isAstroClassInstance);
      check(field,String)
      check(from,String)
      check(to,String)
      let role = Role.check(model)
      return Lifecycle.getTransitionsForRole(from,role,field,to).length !== 0
    }

    Lifecycle.getComingTransitions = function(to) {
      return comingTransitions[to] || [];
    }

    // Set states properties in the class.
    _each(states, (state) => {
      if (Object.defineProperty) {
        // for each state, we have a property in Lifecycle, not writable
        Object.defineProperty(Lifecycle, state, {
          writable: false,
          enumerable: true,
          value: state
        });
      }
      else {
        Lifecycle[state] = state;
      }
    });

    if (Object.defineProperty) {
      Object.defineProperty(Lifecycle.prototype,"value", {
        writetable: false,
        enumerable: true,

      })
    }

    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Lifecycle,
      /***
       * @description validation of the lifecycle
       * @param {Object} args
       * @param {Class} args.doc - nested document to be validated
       * @param {String} args.name - field (from upper document) name to be checked
       * @param {String} args.nestedName - nested field name
       * @param args.value - value of the field
       */
      cast(value) {
        // return new Lifecycle(value)
        if (typeof value === "string" && value !== "") {
          return value;
        }
        return defaultState;
      },
      validate(args) {
        let doc = args.doc
        let Class = doc.constructor
        Validators.string(args);
        if (Class.isNew(doc)) {
          args.param = Lifecycle.getDefault()
          Validators.equal(args)
        } else {
          let oldDoc = Class.findOne(doc._id)
          let oldValue = oldDoc.get(args.name)
          args.param = oldValue
          Validators.lifecycle(args)
        }
        args.param = states;
        Validators.choice(args);
      }
    });
    // Store lifecycle in the lifecycles list.
    this.lifecycles[definition.name] = Lifecycle;

    return Lifecycle;
  }
}

Lifecycle.lifecycles = {}

export default Lifecycle;