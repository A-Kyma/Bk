import { Class } from 'meteor/akyma:astronomy'



const Import = Class.create({
    name: 'Import',
    fields: {
        file: { type: String},
        headers: { type: [String]},
        column_count: {type: Number},
        targetModel: { type: Class}
    },

})

export { Import };