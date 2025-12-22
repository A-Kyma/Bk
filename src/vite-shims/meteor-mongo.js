// Shim for `import { Mongo } from 'meteor/mongo'`
export const Mongo = (typeof window !== 'undefined' && window.Mongo) ? window.Mongo : {}
export default Mongo
