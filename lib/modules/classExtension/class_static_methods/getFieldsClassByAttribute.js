import _each from 'lodash/each';

function getFieldsClassByAttribute(attribute, value) {

    const fields = [];

    _each(this.schema.fields, (field) => {

        if (field[attribute] === value){
            fields.push(field);
        }
    });

    return fields
}

export default getFieldsClassByAttribute