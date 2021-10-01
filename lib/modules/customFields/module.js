import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';
import onApplyDefinition from "./hooks/apply_definition";
import onInitClass from "./hooks/init_class";

import './types/email'
import './types/color'
import './types/password'
import './types/amount'
import './types/integer'
import './types/number'
import './types/image'
import './types/textarea'
import './types/time'
import './types/datetime'
import './types/phone'
import './types/domain'
import './types/url'

import Amount from "./classes/Amount";
import Color from "./classes/Color"
import DateTime from "./classes/DateTime";
import Email from './classes/Email.js';
import Enum from "./customs/Enum";
import Domain from "./classes/Domain";
import Integer from "./classes/Integer";
import Image from "./classes/Image";
import Languages from "./types/language";
import Variant from "./types/variant"
// import Lifecycle from "./customs/Lifecycle"; // Lifecycle imported in lib.js since cycling dependencies
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
  onInitClass: onInitClass,
});

export {
  Color, Domain, Email, Enum, Amount, DateTime, Integer, Image, Languages,
  Password, Phone, Textarea, Time, Url, Variant};
