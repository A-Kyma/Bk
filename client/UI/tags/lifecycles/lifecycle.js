import './lifecycle.html';

Template._lifecycleInner.helpers({
  material() { if ($.material) { return true; } },
  iconName() {
    return this.model.constructor._fields[this.field].transition[this.transition].icon;
  },
  isMobile() {
    return global.BkClientCore._device.isMobile();
  }
});


Template._lifecycleInner.onRendered(() => $('[data-toggle="tooltip"]').tooltip());

Template._lifecycleInner.events({
  'click button'(event) {
    if (this.transition) { this.model.constructor.findInstance(this.model.id).lifecycle(this.field,this.transition); }
    return false;
  },
  'click a'() {
    if (this.transition) { return this.model.constructor.findInstance(this.model.id).lifecycle(this.field,this.transition); }
  }
});

Template._lifecycle.helpers({
  authorize() { return (this.model.lifeCycle && this.model.lifeCycle[this.field] && this.model.lifeCycle[this.field][this.transition]) || false; },
  lfclass() { return (this.model.constructor._fields[this.field].transition[this.transition].class || "") + " " + (this.class || ""); },
  needModal() {
    const nm = this.model.constructor._fields[this.field].transition[this.transition].needModal;
    return nm && (typeof(nm) === "function") && nm(this.model.attributes);
  },
  confirm() { return this.model.constructor._fields[this.field].transition[this.transition].confirm; },
  modalTemplate() { return this.model.constructor._fields[this.field].transition[this.transition].modalTemplate; },
  title() { return this.model._type + ".transition." + this.transition; },

// This one is needed in order to have full model (using findInstance to have old_attributes)
  getModalContext() {
    const context = _.clone(this);
    const klass = this.model.constructor;
    context.model = klass.findInstance(this.model.id);
    context.lfclass = this.model.constructor._fields[this.field].transition[this.transition].modalTemplate;
    context.title = this.model._type + ".transition." + this.transition;
    return context;
  }
});

Template.lifecycleActions.helpers({
  lifecycleTransitions() {
    const {
      model
    } = this;
    const {
      field
    } = this;
    if (!model || !model.constructor._fields[field] || !model.constructor._fields[field].transition) { return []; }
    return _.keys(model.constructor._fields[field].transition);
  },
  hasAccess() {
    const self = this;
    const context = Template.parentData();
    const {
      model
    } = Template.parentData();
    return model.lifeCycle[context.field][self];
  }});

Template._viewLifecycle.helpers({
  class() {
    return this.class;
  },
  iconClass() {
    //TODO: transform lifecycle.values into hashtable of value: {options}, ie:
    // {value: 'active', class: 'label-success'} becomes
    //  'active': {class: 'label-success'}
    const lifecycle = this.model.constructor._fields[this.field];
    const currentState = this.model.attributes[this.field];
    const state = _.find(lifecycle.values,s => s.value === currentState);
    return state && state.class;
  },
  value() {
    return this.model._type + ".lifecycle." + this.model.attributes[this.field];
  }});