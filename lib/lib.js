// This will load modules which have effects on class / fields definition
import Bk from "./modules/core/utils/Bk";
// Add Bk methods definitions
import './utils/BkLib.js'
import './utils/BkCore.js';

// Some custom fields types
import {
  Color, DateTime, Domain, Email, Enum, Amount, Avatar, Image, Integer, Languages,
  Password, Textarea, Time, TrimmedString, Percentage, Phone, Url, Variant, Rating, Hex
} from './modules/customFields/module.js';
import './modules/customFields/module';

// Add class extension : getDefinition, getDoc, getModel
import './modules/classExtension/module';

// Set helper defaultName to Schema/defaultName function or a field having defaultName to true or field "name" or field "title"
import './modules/defaultName/module.js';

// custom Events : add beforeSet and afterSet
import './modules/events/module';

// Add label key as field definition parameter
import './modules/labels/module';

// Add permissions : canCreate, canView, canUpdate, canDelete
import './modules/permissions/module';

// Create new types of validators
import './modules/validators/module.js';

// Allow validators to be set in the same line as the type of the field. No long validator notations required
// Pay attention that we should avoid import validators modification after this one.
import './modules/inlineValidators/module.js';

// Add errors helpers after all validators modules to ensure resolveError is not overwritten by an extend using validators
import './modules/errors/module';

// Relations
import './modules/relations/module.js';

// Behaviors
// Audit
import './modules/audit/behavior';

// Internationalization
import I18n from "./classes/i18n.js";
import './../i18n/loadTranslation';

// Special classes - User needs Email field
import Filter from './classes/filters.js';
import Datatable from "./classes/datatable.js";
import {User,UserProfile} from "./classes/user";
import Role from "./classes/role";
import Files from "./classes/files" // Using Ostrio:Files
import {Device} from "./classes/device"
import Meta from "./classes/meta";
import Statistic from "./classes/statistics";
import Lifecycle from "./modules/customFields/customs/Lifecycle"
import ParameterTableElement from "./classes/parameterTableElement"
import ParameterTable from "./classes/parameterTable"
// custom field classes extended with I18n
import "./modules/customFields/customs/AmountExtension"
import "./modules/customFields/customs/DateExtention"
import "./modules/customFields/customs/DateTimeExtension"

import config from "./core/config";
import * as reservedKeywords from "./core/reserved_keywords";

// Variables exported by this module can be imported by other packages and
// applications. See bk-tests.js for an example of importing.
// Only variables that could be useful externally are exported.

import BkUI from "../client/UI/BkUI";

export {
  Amount,
  Avatar,
  Bk,
  BkUI,
  BkUI as UI,
  config,
  Color,
  Datatable,
  DateTime,
  Device,
  Domain,
  Email,
  Enum,
  Files,
  Filter,
  Hex,
  I18n,
  Image,
  Integer,
  Languages,
  Lifecycle,
  Meta,
  ParameterTable,
  ParameterTableElement,
  Password,
  reservedKeywords,
  Percentage,
  Phone,
  Role,
  Textarea,
  Time,
  TrimmedString,
  Url,
  User,
  UserProfile,
  Variant,
  Rating,
  Statistic
}