import {I18n} from "meteor/a-kyma:bk"
import _each from 'lodash/each';

function getImportFieldsClass(options = {}) {

    const fields = [];
    let importField = {};
    let placeholder = I18n.get('app.import.column.label');

    _each(this.schema.fields, (field) => {

        // Don't get a transient field.
        if (!options.transient && field.transient) {
            return;
        }
        // Don't get an immutable field.
        if (!options.immutable && field.immutable) {
            return;
        }
        // Don't get _id
        if (field.name === "_id"){
            return;
        }
        // Don't get meta
        if (field.name === "meta"){
            return;
        }
        if (field.import === false){
            return;
        }

        let fieldType = field.constructor.name

        if (fieldType === 'ScalarField' || fieldType === 'ListField'){
            importField = {}
            importField.placeholder = placeholder
            importField.optional = field.optional
            if (field.optional){
                importField.label = I18n.get(field.label)
            }else{
                importField.label = I18n.get(field.label) + '*'
            }
            importField.name = field.name
            if (fieldType === 'ListField'){
                importField.format = 'list'
            }else{
                importField.format = 'string'
            }

            fields.push(importField);
        }
        if (fieldType === 'ObjectField'){

            let childClass = field.type.name
            let childFields = field.type.class.definition.fields
            for (const childField in childFields){

                importField = {}
                importField.placeholder = placeholder

                if (childFields[childField].optional){
                    importField.optional = childFields[childField].optional
                }else{
                    importField.optional = field.optional
                }
                if (importField.optional){
                    importField.label = I18n.get(childClass + '.' + childField + '.label')
                }else{
                    importField.label = I18n.get(childClass + '.' + childField + '.label') + '*'
                }
                importField.name = field.name + '.' + childField
                importField.format = 'string'

                fields.push(importField);
            }
        }
    });
    return fields
};

export default getImportFieldsClass