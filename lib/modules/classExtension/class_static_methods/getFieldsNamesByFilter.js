import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import _indexOf from 'lodash/indexOf';

function getFieldsNamesByFilter(options = {}) {
    // Prepare options.
    _defaults(options, {
        transient: true,
        immutable: true
    });
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
        // Don't get _id
        if (name === "_id"){
            return;
        }
        if (options.exclude){
            if (_indexOf(exclude,name) !== -1){
                return;
            }
        }
        fieldsNames.push(name);
    });

    return fieldsNames;
};

export default getFieldsNamesByFilter;