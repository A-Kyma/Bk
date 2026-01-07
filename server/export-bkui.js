// Server-side exports for akyma:bk
// Use server-only version of BkUI (no bootstrap-vue-3 or other client-only dependencies)

import BkUIDefault from './BkUI-server';

/* global BkUI, UI */
// Assign to package-scoped globals so `api.export()` can expose them
BkUI = BkUIDefault;
UI = BkUIDefault; // legacy alias

export {};

