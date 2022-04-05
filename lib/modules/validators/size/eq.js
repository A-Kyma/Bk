import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
    name: 'eq',
    parseParam(param) {
        if (!Match.test(param, Match.OneOf(Number,String,Boolean))) {
            throw new TypeError(
                `Parameter for the "eq" validator has to be a number/string/boolean`
            );
        }
    },
    isValid({ value, param }) {
        return _eq(value.length, param)
    },
    resolveError({ name, param }) {
        return `Length of "${name}" has to be of length ${param}`;
    }
});