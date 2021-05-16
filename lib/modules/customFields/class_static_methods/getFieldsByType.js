import _filter from 'lodash/filter';

function getStaticFieldByType(type) {
  return _filter(this.getFields(), function(field) {
    return field.type.class.name === type;
  });
};

export default getStaticFieldByType;