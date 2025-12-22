// Generic shim for any `meteor/*` import during Vite dev/build.
// Returns empty objects/functions to prevent build errors.

// Create a basic mock that acts as both an object and a function
const createMock = () => {
  const mockFn = function() { return mockFn; };
  mockFn.prototype = {};
  return new Proxy(mockFn, {
    get(target, prop) {
      if (prop === 'then' || prop === Symbol.toStringTag) return undefined;
      if (typeof window !== 'undefined' && window[prop]) return window[prop];
      return mockFn;
    },
    apply() { return mockFn; },
    construct() { return mockFn; }
  });
};

const mock = createMock();

// Export common Meteor classes/objects as named exports
export const Class = mock;
export const ValidationError = mock;
export const ScalarField = mock;
export const ObjectField = mock;
export const ListField = mock;
export const Union = mock;
export const I18n = mock;
export const DateTime = mock;
export const User = mock;
export const Role = mock;
export const Accounts = mock;
export const EJSON = mock;
export const Enum = mock;
export const Lifecycle = mock;
export const Image = mock;
export const Meteor = mock;
export const Mongo = mock;
export const Tracker = mock;

export default mock;
