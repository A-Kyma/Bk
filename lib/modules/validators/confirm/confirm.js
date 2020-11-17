import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
    name: 'confirm',
    parseParam(param) {
        if (!Match.test(param, Boolean)) {
            throw new TypeError(
                `Parameter for the "eq" validator has to be a function returning a boolean`
            );
        }
    },
    isValid({ value, param }) {
        return param;
    },
    resolveError({ name, param }) {
        return `Field "${name}" is not confirmed`;
    }
});