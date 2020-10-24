import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
    name: 'eq',
    parseParam(param) {
        if (!Match.test(param, Number)) {
            throw new TypeError(
                `Parameter for the "eq" validator has to be a number`
            );
        }
    },
    isValid({ value, param }) {
        return !_eq(value, param) ;
    },
    resolveError({ name, param }) {
        return `Length of "${name}" has to be ${param}`;
    }
});