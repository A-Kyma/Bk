import {Class} from 'meteor/jagi:astronomy';
import Enum from "../customs/Enum"

const BooleanEnum = Enum.create({
    name: "BooleanEnum",
    identifiers: [true,false]
})

export default BooleanEnum;