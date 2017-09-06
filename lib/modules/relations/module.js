import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';
// Hooks.
import onInitSchema from './hooks/onInitSchema.js';
import onInitDefinition from './hooks/onInitDefinition.js';
import onParseDefinition from './hooks/onParseDefinition.js';
import onMergeDefinitions from './hooks/onMergeDefinitions.js';
import onApplyDefinition from './hooks/onApplyDefinition.js';
import onInitClass from './hooks/onInitClass.js';

Module.create({
  name: 'relations',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});