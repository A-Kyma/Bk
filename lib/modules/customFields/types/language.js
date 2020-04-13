import {Class,Enum} from 'meteor/jagi:astronomy';

const Languages = Enum.create({
  name: 'Languages',
  identifiers: {
    en: "English",
    fr: "Français",
    nl: "Nederlands",
    de: "Deutsch"
  }
});

export default Languages;