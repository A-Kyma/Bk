//import {Class,Enum} from 'meteor/jagi:astronomy';
import Enum from "../customs/Enum";
import config from "../../../core/config";

const Languages = Enum.create({
  name: 'Languages',
  identifiers: config.translation.locales
});

export default Languages;