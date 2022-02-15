import { Class, Module } from 'meteor/jagi:astronomy';
import _noop from 'lodash/noop';

/**
 * getDefinition : On Class created and Class instanciated (model)
 *                 Give the field definition for this class
 *                 ex: User.getDefinition(field)
 * getDoc : for model : get the parent doc for the field asked
 *          ex: model.getDoc(field)
 * isPersisted : for model. False if model is not yet in database
 * getModel : extension of Astronomy Class.
 *            Check model given. Create new one if string given
 *            Then, check model has been created by Class.create.
 *            return undefined if unknown
 *            ex: import { Class } from 'meteor/jagi:astronomy';
 *                this.model=Class.getModel("USER");
 */

// Hooks.
import onInitClass from './hooks/init_class.js';
import getModel from "./class_static_methods/getModel";
import getClass from "./class_static_methods/getClass";
import createFilterClass from "./class_static_methods/createFilterClass";
import getImportFieldsClass from "./class_static_methods/getImportFieldsClass";
import getFieldsClassByAttribute from "./class_static_methods/getFieldsClassByAttribute";

// Extension of Astronomy Class !
Class.getModel = getModel;
Class.getClass = getClass;
Class.createFilterClass = createFilterClass
Class.getImportFieldsClass = getImportFieldsClass
Class.getFieldsClassByAttribute = getFieldsClassByAttribute

Module.create({
  name: 'classExtension',
  onInitSchema: _noop,
  onInitDefinition: _noop,
  onParseDefinition: _noop,
  onMergeDefinitions: _noop,
  onApplyDefinition: _noop,
  onInitClass: onInitClass,
});

