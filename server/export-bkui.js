// Server bridge to expose BkUI for SSR/PDF rendering
// Ensures `import { BkUI } from 'meteor/akyma:bk'` works on server.

import BkUIDefault from '../client/UI/BkUI';

/* global BkUI, UI */
// Assign to package-scoped globals so `api.export()` can expose them
BkUI = BkUIDefault;
UI = BkUIDefault; // legacy alias

export {};
