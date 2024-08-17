import {Class} from 'meteor/akyma:astronomy';
import Enum from "../customs/Enum"

const BooleanEnum = Enum.create({
    name: "BooleanEnum",
    identifiers: [true,false]
})

export default BooleanEnum;