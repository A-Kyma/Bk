import _noop from 'lodash/noop';

function onInitClass(Class, className) {
  // Class static methods.

  // Class prototype methods.
  Class.prototype.canView = _noop;
  Class.prototype.canCreate = _noop;
  Class.prototype.canUpdate = _noop;
  Class.prototype.canEdit = _noop;
  Class.prototype.canDelete = _noop;
};

export default onInitClass;