import { ListField, ObjectField, ScalarField } from "meteor/jagi:astronomy"
import {Class} from "meteor/jagi:astronomy"
//import {I18n} from "meteor/akyma:bk"
import _each from 'lodash/each';

function getImportFieldsClass(options = {}) {
    const I18n = Class.get("I18n")
    const fields = [];
    let importField = {};
    let placeholder;
    if (options.importFileType === undefined){
        placeholder = I18n.get('app.import.column.csv.label');
    }else{
        placeholder = I18n.get('app.import.column.'+options.importFileType+'.label');
    }

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
        if (field.importFieldContext && typeof field.importFieldContext === 'object'){
            I18n.setContext(field.importFieldContext);
        }
        if (field instanceof ScalarField || field instanceof ListField){
            importField = {}
            importField.placeholder = placeholder
            importField.optional = field.optional
            if (field.optional){
                importField.label = I18n.get(field.label)
            }else{
                importField.label = I18n.get(field.label) + '*'
            }
            importField.name = field.name
            if (field instanceof ListField){
                importField.format = 'list'
            }else{
                importField.format = 'string'
            }

            fields.push(importField);
        }
        if (field instanceof ObjectField){

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