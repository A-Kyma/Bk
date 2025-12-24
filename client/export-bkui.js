// Bridge file to expose BkUI as a Meteor package export
// so consumers can `import { BkUI } from 'meteor/akyma:bk'`.

import BkUIDefault from './UI/BkUI';

/* global BkUI, UI */
// Assign to package-scoped globals so `api.export()` can expose them
BkUI = BkUIDefault;
UI = BkUIDefault; // legacy alias

export {};
