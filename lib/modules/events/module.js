import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';

// Hooks.
import onInitClass from './hooks/init_class.js';

Module.create({
  name: 'customEvents',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: _noop,
  onInitClass: onInitClass
});