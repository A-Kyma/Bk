import {Class,Enum} from 'meteor/akyma:astronomy';

export const Filters = new Mongo.Collection('filters');

//TODO options should be of type Hash !
const Filter = Class.create({
  name: 'Filter',
  collection: Filters,
  secured: false,
  fields: {
    name: { type: String, name: 1},
    options: { type: Object }
  }
})

export default Filter;