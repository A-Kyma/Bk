import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';
import onApplyDefinition from "./hooks/apply_definition";

import './types/email.js';
import './types/amount'
import './types/integer'
import './types/number'
import './types/image'

import Email from './classes/Email.js';
import Enum from "./customs/Enum";
import Amount from "./classes/Amount";
import Integer from "./classes/Integer";
import Image from "./classes/Image";
import Languages from "./types/language";
import Lifecycle from "./customs/Lifecycle";

Module.create({
  name: 'customFields',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: onApplyDefinition,
  onInitClass: _noop,
});

export { Email, Enum, Amount, Integer, Image, Languages, Lifecycle };

