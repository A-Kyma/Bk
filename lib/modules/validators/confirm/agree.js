import _eq from 'lodash/eq';
import { Validator } from 'meteor/akyma:astronomy';

Validator.create({
    name: 'agree',
    parseParam(param) {
        if (!Match.test(param, Boolean)) {
            throw new TypeError(
                `Parameter for the "agree" validator has to be a boolean`
            );
        }
    },
    isValid({ value, param }) {
        if (param)
            return value === true
        else
            return true
    },
    resolveError({ name, param }) {
        return `Field "${name}" is not agreed`;
    }
});