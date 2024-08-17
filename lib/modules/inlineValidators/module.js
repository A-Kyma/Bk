/***
Get the validators inline (no need to have validators: [{ type: 'minLength', param: 3}]
We can put only :
minLength: 3

Furthermore, if the parameter is a function
minLength: function(arg) { arg.doc[otherField].length }

Will be equivalent to
validators: [{ type: 'minLength', resolveParam: function(arg) { arg.doc[otherField].length} }]
***/


import { Module } from 'meteor/akyma:astronomy';
import _noop from 'lodash/noop';

// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
  name: 'inlineValidators',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: _noop,
});