import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';
import onApplyDefinition from "./hooks/apply_definition";

import './types/email'
import './types/password'
import './types/amount'
import './types/integer'
import './types/number'
import './types/image'
import './types/textarea'
import './types/time'
import './types/phone'
import './types/url'

import Email from './classes/Email.js';
import Enum from "./customs/Enum";
import Amount from "./classes/Amount";
import Integer from "./classes/Integer";
import Image from "./classes/Image";
import Languages from "./types/language";
import Lifecycle from "./customs/Lifecycle";
import Password from "./classes/Password";
import Phone from "./classes/Phone";
import Textarea from "./classes/Textarea";
import Time from "./classes/Time";
import Url from "./classes/Url";

Module.create({
  name: 'customFields',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: onApplyDefinition,
  onInitClass: _noop,
});

export {
  Email, Enum, Amount, Integer, Image, Languages, Lifecycle,
  Password, Phone, Textarea, Time, Url
};

