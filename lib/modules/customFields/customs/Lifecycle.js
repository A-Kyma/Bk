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
import _each from 'lodash/each';
import { Type, Validators, Class } from 'meteor/jagi:astronomy';
import { check, Match } from 'meteor/check';

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

const Lifecycle = {
  // Contains list of Lifecycles
  lifecycles: {},

  // Create a new Lifecycle
  create(definition) {

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

    /***
     * Create a new Lifecycle constructor.
     * @param {String} state - a state defined in the Lifecycle
     * @returns value of the current state
     * @constructor
     */
    const Lifecycle = function Lifecycle(state) {
      // Simply return the state value
      if (state === undefined) return defaultState;
      return Lifecycle[state];
    };

    Lifecycle.getName = function() {
      return definition.name;
    };

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

    Lifecycle.getStateVariant = function(state) {
      check(state,String);
      return definition.states[state] && definition.states[state].variant;
    }

    Lifecycle.getTransition = function(transition) {
      return definition.transitions[transition];
    };

    Lifecycle.getTransitions = function() {
      return transitions;
    };

    Lifecycle.getAvailableTransitions = function(from) {
      return availableTransitions[from] || [];
    };

    /***
     * validation of the lifecycle
     * @param {String} from: status from
     * @param {String} role: role of the user or left undefined
     * @return {Array} list of transitions available
     */
    Lifecycle.getTransitionsForRole = function(from,role) {
      check(from,String);
      check(role,String);
      return _filter(Lifecycle.getTransitions(), function(t) {
        // if from is not the same, check next transition
        if (t.from !== from) return false;

        // if no role defined and no role asked, transition available
        if (Match.test(t.roles,undefined) && role === undefined) {
          return true;
        }

        // if role in the list of roles, transition available
        if (Match.test(t.roles,Array)) {
          if (role === undefined) return t.roles === [];
          return t.roles.includes(role)
        }

        // if role matches roles, transition available
        if (Match.test(t.roles,String)) {
          if (role === undefined) return t.roles === ""
          return t.roles === role
        }
        return false;
      })
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

    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Lifecycle,
      /***
       * validation of the lifecycle
       * @param {Object} args
       * @param {Class} args.doc - nested document to be validated
       * @param {String} args.name - field (from upper document) name to be checked
       * @param {String} args.nestedName - nested field name
       * @param args.value - value of the field
       */
      cast(value) {
        if (typeof value === "string" && value !== "") {
          return value;
        }
        return defaultState;
      },
      validate(args) {
        Validators.string(args);
        args.param = states;
        Validators.choice(args);
      }
    });
    // Store lifecycle in the lifecycles list.
    this.lifecycles[definition.name] = Lifecycle;

    return Lifecycle;
  },
};

export default Lifecycle;