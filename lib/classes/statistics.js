import { Class } from 'meteor/akyma:astronomy'
import { Enum, DateTime } from "../modules/customFields/module.js";

const Methods = Enum.create({
    name: "Methods",
    identifiers: ["Average","Median","Mode","Standard Deviation"]
})

const Periods = Enum.create({
    name: "Periods",
    identifiers: ["Daily","Weekly","Biweekly","Monthly","Bimonthly","Quarterly","Biannual","Annual"]
})

const statistics = new Mongo.Collection("statistics");
const Statistic = Class.create({
    name: 'Statistic',
    collection: statistics,
    fields:{
        model: { type: String},
        computeFields: { type: [String]},
        groupedBy: { type: [String]},
        computeMethod: {type: Methods},
        computePeriods: {type: Periods},
        startDate: {type: DateTime},
        endDate: {type: DateTime, optional: true },
    },

})

export default Statistic ;