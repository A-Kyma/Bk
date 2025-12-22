// Shim for `import { Tracker } from 'meteor/tracker'`
export const Tracker = (typeof window !== 'undefined' && window.Tracker) ? window.Tracker : { autorun: ()=>{}, onInvalidate: ()=>{} }
export default Tracker
