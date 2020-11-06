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

const enumDefinitionPattern = {
  name: String,
  identifiers: Array
};

const Enum = {
  create(definition) {
    check(definition, enumDefinitionPattern);

    // Get identifiers and values.
    let identifiers = definition.identifiers;

    const values = _keys(identifiers);
    const keys = _keys(identifiers);
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    Enum.getLabelKey = function(field) {
      return "Enum." + definition.name + "." + field + ".label";
    };
    Enum.getValues = function() {
        return identifiers;
    };
    Enum.getIdentifiers = function() {
      return identifiers;
    };
    Enum.getIdentifier = function(value) {
      if (identifiers.includes(value)) return value;
    };
    // Set identifiers properties in the class.
    _each(identifiers, (value) => {
      if (Object.defineProperty) {
        Object.defineProperty(Enum, value, {
          writable: false,
          enumerable: true,
          value
        });
      } else {
        Enum[value] = value;
      }
    });
    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Enum,
      validate(args) {
        args.param = identifiers;
        Validators.choice(args);
      }
    });
    // Store enum in the enums list.
    this.enums[definition.name] = Enum;

    return Enum;
  },
  enums: {}
};

export default Enum;