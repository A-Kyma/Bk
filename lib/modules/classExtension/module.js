import { Class, Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';

// Hooks.
import onInitClass from './hooks/init_class.js';
import getModel from "./class_static_methods/getModel";

// Extension of Astronomy Class !
Class.getModel = getModel;

Module.create({
  name: 'classExtension',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: _noop,
  onInitClass: onInitClass,
});

