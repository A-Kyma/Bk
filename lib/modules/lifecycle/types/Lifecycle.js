/***
 * Same as original jagi:astronomy, but only accept Array identifiers
 * each element will be the value stored, as is
 */

import _zipObject from 'lodash/zipObject';
import _range from 'lodash/range';
import _forOwn from 'lodash/forOwn';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _values from 'lodash/values';
import _keys from 'lodash/keys';
import _indexOf from 'lodash/indexOf';
import _each from 'lodash/each';
import { Type, Validators } from 'meteor/jagi:astronomy';
import { check, Match } from 'meteor/check';

const lifecycleDefinitionPattern = {
  name: String,
  status: Match.Where((x) => {
    return Match.Object(x) &&
    _each(x,(value,key) => {
      return Match.String(key) &&
      Match.test(value,{class: String})
    })
  }),
  initial: String,
  transitions: Match.Where((x) => {
    return Match.Object(x) &&
    _each(x,(value,key) => {
      return Match.String(key) &&
      Match.test(value, {
        from: String,
        to: String,
        class: String,
        roles: Match.Optional(Match.OneOf(Array,String)),
        condition: Match.Where((y) => {
          return typeof(y) === "function"
        })
      })
    })
  })
};

const Lifecycle = {
  create(definition) {
    check(definition, lifecycleDefinitionPattern);

    // Get identifiers and values.
    let identifiers;
    if (Match.test(definition.identifiers, Array)) {
      identifiers = _zipObject(
        definition.identifiers, _range(definition.identifiers.length)
      );
    }
    else if (Match.test(definition.identifiers, Object)) {
      identifiers = definition.identifiers;
      let i = 0;
      _forOwn(identifiers, function(value, key) {
        if (_isNil(value)) {
          identifiers[key] = i;
          i++;
        }
        else if (_isNumber(value)) {
          i = value + 1;
        }
      });
    }
    const values = _keys(identifiers);
    const keys = _keys(identifiers);
    // Create a new Lifecycle constructor.
    const Lifecycle = function Lifecycle(identifier) {
      return Lifecycle[identifier];
    };
    Lifecycle.getValues = function() {
        return values;
    };
    Lifecycle.getIdentifiers = function() {
      return keys;
    };
    Lifecycle.getIdentifier = function(value) {
      const index = _indexOf(values, value);
      return keys[index];
    };
    // Set identifiers properties in the class.
    _each(identifiers, (value, name) => {
      if (Object.defineProperty) {
        Object.defineProperty(Lifecycle, name, {
          writable: false,
          enumerable: true,
          value
        });
      }
      else {
        Lifecycle[name] = value;
      }
    });
    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Lifecycle,
      validate(args) {
        args.param = values;
        Validators.choice(args);
      }
    });
    // Store enum in the enums list.
    this.lifecycles[definition.name] = Lifecycle;

    return Lifecycle;
  },
  enums: {}
};

export default Lifecycle;