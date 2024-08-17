import _eq from 'lodash/eq';
import { Validator } from 'meteor/akyma:astronomy';

Validator.create({
    name: 'check',
    parseParam(param) {
        if (!Match.test(param, Boolean)) {
            throw new TypeError(
                `Parameter for the "check" validator has to be a function returning a boolean`
            );
        }
    },
    isValid({ value, param }) {
        return param;
    },
    resolveError({ name, param }) {
        return `Field "${name}" is not valid`;
    }
});