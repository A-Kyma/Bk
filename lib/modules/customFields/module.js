import { Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';
import onApplyDefinition from "./hooks/apply_definition";
import onInitClass from "./hooks/init_class";

import './types/email'
import './types/color'
import './types/password'
import './types/amount'
import './types/avatar'
import './types/integer'
import './types/rating'
import './types/number'
import './types/date'
import './types/image'
import './types/textarea'
import './types/time'
import './types/datetime'
import './types/phone'
import './types/domain'
import './types/url'
import './types/hex'
import './types/booleanEnum'
import './types/percentage'

import Amount from "./classes/Amount";
import Avatar from "./classes/Avatar";
import Rating from "./classes/Rating";
import Color from "./classes/Color"
import DateTime from "./classes/DateTime";
import Domain from "./classes/Domain";
import Email from './classes/Email.js';
import Enum from "./customs/Enum";
import Hex from "./classes/Hex";
import Integer from "./classes/Integer";
import Image from "./classes/Image";
import Languages from "./types/language";
import Percentage from "./classes/Percentage"
import Variant from "./types/variant"
import BkChartView from "./types/bkChartView"
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
  BkChartView, Color, Domain, Email, Enum, Amount, Avatar, DateTime, Integer, Image,
  Languages, Password, Percentage, Phone, Textarea, Time, Url, Variant, Rating, Hex};

