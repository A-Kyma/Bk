/***
 * Same as original jagi:astronomy, but only accept Array identifiers
 * each element will be the value stored, as is
 */
import {Class} from "meteor/jagi:astronomy"
import _zipObject from 'lodash/zipObject';
import _range from 'lodash/range';
import _forOwn from 'lodash/forOwn';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _values from 'lodash/values';
import _keys from 'lodash/keys';
import _indexOf from 'lodash/indexOf';
import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import _has from 'lodash/has';
import _includes from "lodash/includes";
import { Type, Validators } from 'meteor/jagi:astronomy';
import { check, Match } from 'meteor/check';

const enumDefinitionPattern = {
  name: String,
  identifiers: Match.OneOf(Array,Match.Where((x)=> typeof x === "function"))
};

const Enum = {
  enums: {},
  has: function(enumName) {
    return _has(this.enums, enumName);
  },
  includes(Enum) {
    return _includes(this.enums, Enum);
  },
  create(definition) {
    check(definition, enumDefinitionPattern);

    // Get identifiers and values.
    let identifiers = (model) => {
      if (typeof definition.identifiers === "function")
        return definition.identifiers(model)
      return definition.identifiers
    }


    const values = _keys(identifiers());
    const keys = _keys(identifiers());
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    Enum.name = "Enum"
    Enum.getClassName = function() { return "Enum" }
    Enum.getName = function() { return definition.name }
    Enum.getLabelKey = function(field) {
      return "Enum." + definition.name + "." + field + ".label";
    };
    Enum.getValues = function() {
        return identifiers()
    };
    Enum.getIdentifiers = function(model) {
      return identifiers(model)
    };
    Enum.getIdentifier = function(value) {
      if (identifiers().includes(value)) return value;
    };
    Enum.isIdentifier = function(value) {
      return identifiers().includes(value)
    }

    // Return options key,value for select/radio/checkbox
    // Load I18n dynamically before create this function since both dependent
    import("../../../classes/i18n").then(I18nModule => {
      const I18n = I18nModule.default;
      Enum.getOptions = function(opts={}) {
        _defaults(opts, {optional: false, sort: true})

        let options = Enum.getIdentifiers().map(x => {
          let key = Enum.getLabelKey(x);
          return {text: I18n.t(key), key, value: x}
        })

        if (opts.optional) {
          let key = "app.undefined"
          options.splice(0, 0, {"text": I18n.t(key,{locale:opts.locale}), key, value: null})
        }

        if (opts.sort) {
          return options.sort((x, y) => x.text.localeCompare(y.text))
        }

        return options
      }
      Enum.getOptionValue = function(externalValue,locale) {
        const options = Enum.getOptions({locale})
        let option = options.find(o => o.text === externalValue)
        if (!option) return undefined
        return option.value
      }

      /*
       * Not working because of I18n...
      // Create type definition for the given enum.
      Type.create({
        name: definition.name,
        class: Enum,
        cast(value) {
          if (Enum.isIdentifier(value))
            return value
          if (Meteor.isClient) {
            return Enum.getOptionValue(value)
          }
          if (Meteor.isServer) {
            for (let locale of I18n.locales) {
              let value = Enum.getOptionValue(value,locale)
              if (value) return value
            }
          }
        },
        validate(args) {
          args.param = identifiers();
          Validators.choice(args);
        }
      })
      */
    })

    // Set identifiers properties in the class.
    _each(identifiers(), (value) => {
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
        args.param = identifiers();
        Validators.choice(args);
      }
    });
    // Store enum in the enums list.
    this.enums[definition.name] = Enum;

    return Enum;
  }
};

export default Enum;