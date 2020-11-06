//import {Class,Enum} from 'meteor/jagi:astronomy';
import Enum from "../customs/Enum";
const Languages = Enum.create({
  name: 'Languages',
  identifiers: [ "en","fr","nl","de"]
});

export default Languages;