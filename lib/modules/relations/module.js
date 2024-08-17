/**
 * Relations
 * Goal of this module is that if we have a subclass with a collection, we should only save it's _id field
 * This implies that the subclass was saved before
 *
 * To declare relations :
 * Class.create({
 *   Name: "Post",
 *   collection: posts,
 *   fields: {
 *     title: { type: String },
 *     user: {
 *        type: User,
 *        subscription:
 *        "relation.search",
 *        where(...args) {  },
 *        cache: true|false
 *        otherOptions...
 *     },
 *     comments: { type: [ Comment ], remoteId: "postId", where(...args) { }, otherOptions... }
 *   }
 * }
 *
 * Will generate :
 * 1) field (when remoteId not set)
 * - userId of type "MongoId" ### See storage module/on_apply_definition hook
 * - with all other options applied
 *
 * 2) helpers
 * Belongs_to relations
 * - user which returns a User giving userId
 * - users which returns all users accessible (using where option)
 * Has many relations
 * - comments which returns all comments linked to remoteId
 *
 * 3) adapt get / set / rawOne commands so it generates the right object
 * - post.user will returns user (of Class User)
 * - post.get("user") = user (of Class User)
 * - post.set("user", user) will modify userId
 * - post.user = user will set userId
 *
 * 4) for remote relations
 * - Nothing will be done to save them from the parent model
 *
 * Subscription
 * is field name + ".search"
 * or given subscription
 *
 * args will contain:
 * model value (id or array of ids)
 * search value
 * language
 */


import { Module } from 'meteor/akyma:astronomy';
import _noop from 'lodash/noop';

//import "./utils/ObjectField";

// Hooks.
import onInitSchema from './hooks/onInitSchema.js';
import onInitDefinition from './hooks/onInitDefinition.js';
import onParseDefinition from './hooks/onParseDefinition.js';
import onMergeDefinitions from './hooks/onMergeDefinitions.js';
import onApplyDefinition from './hooks/onApplyDefinition.js';
import onInitClass from './hooks/onInitClass.js';

Module.create({
  name: 'relations',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});