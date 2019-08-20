// This will load modules which have effects on class / fields definition

// Set helper defaultName to Schema/defaultName function or a field having defaultName to true or field "name" or field "title"
import './modules/defaultName/module.js';

// Create new types of validators
import './modules/validators/module.js';
// Allow validators to be set in the same line as the type of the field. No long validator notations required
import './modules/inlineValidators/module.js';

// Internationalization
import { I18n} from "./modules/i18n/module.js";

// Some custom fields types
import { Email } from './modules/customFields/module.js';

// Relations
import './modules/relations/module.js';

// Variables exported by this module can be imported by other packages and
// applications. See bk-tests.js for an example of importing.
export const name = 'bk';
const Bk = {
  Email,
  I18n
};

export {
  Bk,
  Email,
  I18n
}