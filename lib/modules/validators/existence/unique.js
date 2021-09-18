import _eq from 'lodash/eq';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
    name: 'unique',
    parseParam(param) {
        if (!Match.test(param, Match.OneOf(Boolean,Array,Object,String))) {
            throw new TypeError(
                `Parameter for the "check" validator has to be a function returning a String, boolean, object or an array`
            );
        }
    },
    isValid({ doc,param,name,value }) { // arg contains className, doc, name, nestedName, value, param, validator
        let selector={}
        selector[name] = value
        if (typeof param === "string") {
            selector[param] = doc[param]
        }
        else if (Array.isArray(param)) {
            param.forEach(e => selector[e] = doc[e])
        }
        else if (typeof param === "object") {
            selector = {...selector,...param}
        }
        if (doc._id) {
            selector._id = {$ne: doc._id}
        }
        return !doc.constructor.getCollection().findOne(selector)
    },
    resolveError({ name, param }) {
        return `Field "${name}" is already chosen`;
    }
});