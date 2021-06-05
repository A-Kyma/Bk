import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
    name: 'lifecycle',
    parseParam(param) {
        if (!Match.test(param, String)) {
            throw new TypeError(
                `Parameter for the "lifecycle" validator has to be a string`
            );
        }
    },
    isValid({ doc, name, value, param }) {
        let Lifecycle = doc.getFieldClass(name)
        return Lifecycle.isAuthorized(doc, name, param, value)
    },
    resolveError({ name, value }) {
        return `Status ${value} is not reachable`;
    }
});