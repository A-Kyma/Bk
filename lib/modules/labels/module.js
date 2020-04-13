// Add label key for each field of a class
// if label is added at field level, it will be used as the key label.

// Afterwards, we get the label key using: model.constructor.schema.fields[field].label
// With module preferenceField, we could get it using
// model.constructor.getPreferenceField(field).label
// This one works also with dotted fields.

import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';

// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class';

Module.create({
  name: 'labels',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});