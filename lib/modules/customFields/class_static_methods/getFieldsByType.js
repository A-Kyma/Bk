import _filter from 'lodash/filter';

function getStaticFieldByType(type) {
  return _filter(this.getFields(), function(field) {
    return (field.type.class.getName && field.type.class.getName() === type)
    || (field.type.class.getClassName && field.type.class.getClassName() === type)
  });
};

export default getStaticFieldByType;