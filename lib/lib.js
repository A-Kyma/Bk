// This will load modules which have effects on class / fields definition
import Bk from "./modules/core/utils/Bk";
// Add Bk methods definitions
import './utils/BkLib.js'
import './utils/BkCore.js';

// Add class extenstion : getDefinition, getDoc, getModel
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

// Special classes
import Filter from './classes/filters.js';
import Datatable from "./classes/datatable.js";

// Internationalization
import I18n from "./classes/i18n.js";
import './../i18n/loadTranslation';

// Some custom fields types
import { Email, Enum, Amount, Integer, Languages } from './modules/customFields/module.js';
import Lifecycle from "./modules/lifecycle/types/Lifecycle";

// Relations
import './modules/relations/module.js';

// Variables exported by this module can be imported by other packages and
// applications. See bk-tests.js for an example of importing.
// Only variables that could be useful externally are exported.

import BkUI from "../client/UI/BkUI";

export {
  Amount,
  Bk,
  BkUI,
  Datatable,
  Email,
  Enum,
  Filter,
  I18n,
  Integer,
  Languages,
  Lifecycle
}