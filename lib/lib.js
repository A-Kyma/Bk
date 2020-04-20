// This will load modules which have effects on class / fields definition
import Bk from "./modules/core/utils/Bk";
// Add Bk methods definitions
import './utils/BkLib.js'
import './utils/BkCore.js';

// Add class extenstion : getDefinition, getDoc, getModel
import './modules/classExtension/module';

// Set helper defaultName to Schema/defaultName function or a field having defaultName to true or field "name" or field "title"
import './modules/defaultName/module.js';

// Add label key as field definition parameter
import './modules/labels/module';

// Add permissions : canCreate, canView, canUpdate, canDelete
import './modules/permissions/module';

// Create new types of validators
import './modules/validators/module.js';

// Allow validators to be set in the same line as the type of the field. No long validator notations required
// Pay attention that we should avoid import validators modification after this one.
import './modules/inlineValidators/module.js';

// Special classes
import Filter from './classes/filters.js';
import Datatable from "./classes/datatable.js";

// Internationalization
import I18n from "./classes/i18n.js";

// Some custom fields types
import { Email, Enum } from './modules/customFields/module.js';

// Relations
import './modules/relations/module.js';

// Variables exported by this module can be imported by other packages and
// applications. See bk-tests.js for an example of importing.
// Only variables that could be useful externally are exported.


export {
  Bk,
  Datatable,
  Email,
  Enum,
  Filter,
  I18n
}