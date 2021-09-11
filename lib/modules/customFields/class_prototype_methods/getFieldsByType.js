import _filter from 'lodash/filter';

function getFieldsByType(type) {
  return this.constructor.getFieldsByType(type)
};

export default getFieldsByType;