//import {Class} from 'meteor/akyma:astronomy';
import Enum from "../customs/Enum";
const Variant = Enum.create({
  name: 'Variant',
  identifiers: [ "primary","secondary","success","danger","warning","info","light","dark"]
});

export default Variant;