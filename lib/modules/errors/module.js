import { Module } from 'meteor/jagi:astronomy';
//Add a reactive error array of ValidationError

import _noop from 'lodash/noop';
import onInitSchema from "./hooks/init_schema";
import onInitDefinition from "./hooks/init_definition";
import onParseDefinition from "./hooks/parse_definition";
import onMergeDefinitions from "./hooks/merge_definitions";
import onApplyDefinition from "./hooks/apply_definition";
import onInitClass from "./hooks/init_class";

Module.create({
  name: 'errors',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});