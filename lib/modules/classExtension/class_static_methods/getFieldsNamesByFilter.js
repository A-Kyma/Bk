import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import _difference from 'lodash/difference';

function getFieldsNamesByFilter(options = {}) {
    // Prepare options.
    let exclude;
    let fields;
    _defaults(options, {
        transient: true,
        immutable: true,
        required: false,
    });
    if (options.fields) {
        if (typeof (options.fields) === "string") {
            fields = options.fields.replace(RegExp(" ", "g"), "").split(",");
        }
        if (Array.isArray(options.fields)) {
            fields = options.fields;
        }
        return fields;
    }
    if (options.exclude) {
        if (typeof (options.exclude) === "string") {
           exclude = options.exclude.replace(RegExp(" ", "g"), "").split(",");
        }
        if (Array.isArray(options.exclude)) {
           exclude = options.exclude;
        }
    }
    const fieldsNames = [];
    _each(this.schema.fields, (field, name) => {
        // Don't get a transient field.
        if (!options.transient && field.transient) {
            return;
        }
        // Don't get an immutable field.
        if (!options.immutable && field.immutable) {
            return;
        }
        // Don't get optional fields
        if (options.required && field.optional) {
            return;
        }
        // Don't get _id
        if (name === "_id"){
            return;
        }
        if (options.exclude && exclude.includes(name)){
            return;
        }
        fieldsNames.push(name);
    });

    return fieldsNames;
};

export default getFieldsNamesByFilter;