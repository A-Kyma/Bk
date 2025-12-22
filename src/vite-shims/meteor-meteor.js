// Shim for `import { Meteor } from 'meteor/meteor'`
// During Vite dev server this proxies to the global `window.Meteor` provided by Meteor when running in Meteor.
// For production build we externalize Meteor imports so this file won't be bundled into the final output.
export const Meteor = (typeof window !== 'undefined' && window.Meteor) ? window.Meteor : {}
export default Meteor
