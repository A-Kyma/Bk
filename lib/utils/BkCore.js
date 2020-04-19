import {Class} from 'meteor/jagi:astronomy';
import _ from 'lodash';
import Bk from "../modules/core/utils/Bk";

Bk.filter = function (hash, filterFunction) {
  if (hash == null) {
    hash = {};
  }
  const result = {};
  for (let field in hash) {
    const pref = hash[field];
    if (filterFunction && filterFunction(pref)) {
      result[field] = pref;
    }
  }
  return result;
}

//TODO klass._fields => klass.schema.fields or klass.getFields() (pay attention to the layout)
// field.type is now of class Type, so we hae to get field.type.getName();
// Moreover, embedded or external relations are not yet defined and will work differently
Bk.belongs_to = function (klass) {
  return Bk.filter(klass._fields, field => field.type === "belongs_to");
}

Bk.has_many = function (klass) {
  return Bk.filter(klass._fields, field => field.type === "has_many");
}

Bk.embedded = function (klass) {
  return Bk.filter(klass._fields, field => field.type === "embedded");
}

//@deprecated
Bk.defaultName = function (model) {
  return model.defaultName();
}

//#################################      GETTER      ##################################
Bk.listDir = function (path) {
  window.resolveLocalFileSystemURL(path, (function (fileSystem) {
    const reader = fileSystem.createReader();
    reader.readEntries((function (entries) {
      console.log(entries);
    }), function (err) {
      console.log(err);
    });
  }), function (err) {
    console.log(err);
  });
}

Bk.getUserDetails = function (userId) {
  //todo - add field list as options
  const user = Meteor.users.findOne({_id: userId});
  if (user !== undefined) {
    let details = {};
    details.name = undefined;
    details.emails = [];
    if (user.services && user.services.google) {
      details.service = 'google';
      details.name = user.services.google.name;
      details.emails.push(user.services.google.email);
    }
    if (user.services && user.services.password) {
      details.service = 'password';
      details.name = user.profile.fullname;
      details.emails.push(user.emails[0].address);
    }
    if (details.name === undefined) {
      details = undefined;
    }
    details.language = 'en'; //default
    return details;
  } else {
    return undefined;
  }
}

Bk.getUserMail = function (userId) {
  const user = Meteor.users.findOne({_id: userId});
  if (user.services && user.services.google) {
    return user.services.google.email;
  }
  if (user.services && user.services.password) {
    return user.emails[0].address;
  }
}

// TODO what's for in Bk ?
Bk.getRandomNews = function (newsType) {
  if ((newsType === 'good') || (newsType === 'bad')) {
    let news;
    if (newsType === 'good') {
      news = ["That's Great", "Yeah Perfect", "Fantastic", "Good news of the day", "Great news", "Congratulation", "Wonderful", "Yes", "All right", "Awesome"];
    }
    if (newsType === 'bad') {
      news = ["Ho no", "Damn", "Too bad", "The bad news minute", "Bad news", "Sorry", "Don't be too disappointed", "I know it's a disaster", "Awful", "Despicable"];
    }
    const n = _.random(0, 9);
    return news[n];
  }
}

// TODO: we can use Class.getFieldsNames() but this contains field "_id" to filter
/*
 * @param Options which contains (amongst others)
 * model: which is the Class or the model instance
 * fields: if filled in, contains fields of model to show
 * exclude: if filled in, contains fields of model to exclude
 * @return {Array} An array of fields strings of the model
 */
Bk.getFieldsArray = function (options) {
  let fields = [];
  let exclude = [];
  let model = Class.getModel(options.model);
  if (options.fields) {
    return options.fields.replace(RegExp(" ", "g"), "").split(",");
  }
  if (typeof model === "function") {
    fields = model.getFieldsNames();
  } else {
    fields = model.constructor.getFieldsNames();
  }

  if (options.exclude) {
    exclude = options.exclude.replace(RegExp(" ", "g"), "").split(",");
  }
  // Always exclude "_id" in a fieldList
  exclude.concat("_id");
  return _.difference(fields, exclude);
}

// Get preferences of field in model.
// This will get the information found in _fields of corresponding class for specified field.
Bk.getFilterPreferenceFields = function (model, field) {
  const pref = _.clone(Bk.getPreferenceFields(model, field));
  if (["textarea", "editor"].includes(pref.type)) {
    pref.type = "text";
  }
  return pref;
}

Bk.getPreferenceFields = function (model, field) {
  if (typeof model === "string") {
    let klass = Class.get("model");
    model = new klass();
  }

  const klass = model.constructor;
  if (!klass) {
    return {};
  }

  //Standard fields
  let pref = klass.schema.fields();
  const fieldPref = pref[field];

  if (fieldPref) {
    return fieldPref;
  }

  //TODO or remove
  //manage technical user fields
  if ((field === 'creationUser') || (field === 'updateUser')) {
    return {type: "belongs_to", class: "User"};
  }
  if (['creationDate', 'updateDate'].includes(field)) {
    return {type: "datetime"};
  }

  //Manage relation like belongs_to and has_many functions
  if (model.relations[field] && model.relations[field]._identifier) {
    field = model.relations[field]._identifier;
    const type = model.relations[field]._type;
    pref = klass._fields[field];
    pref._identifier = field;
    pref.type = type;
  }

  //Management of deep relations like has_many and belongs_to
  if (_.contains(field, ".")) {
    const array = field.split(".");
    const relation = array.shift();
    if (model.relations[relation] && _.isFunction(model.relations[relation]) && model.relations[relation]._identifier) {
      field = array.join(".");
      model = model.relations[relation]();
      return Bk.getPreferenceFields(model, field);
    }
  }
  return {};
}

Bk.getLifecycleFields = function (model) {
  const value = [];
  for (let field in model.constructor._fields) {
    const pref = model.constructor._fields[field];
    if (pref.type === 'lifecycle') {
      value.push(field);
    }
  }
  return value;
}

Bk.getLocalOptions = function (local) {
  if (local === 'fr') {
    return {
//CALENDAR TRADUCTION
      buttonText: {
        today: 'Aujourd\'hui',
        month: 'Mois',
        day: 'Jour',
        week: 'Semaine'
      },
      monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'samedi'],
      dayNamesShort: ['Di', 'Lu', 'Ma', 'Me', 'Je', 've', 'Sa'],
      titleFormat: {
        month: 'MMMM yyyy',
        week: "d[ MMMM][ yyyy]{ - d MMMM yyyy}",
        day: 'dddd d MMMM yyyy'
      },
      columnFormat: {
        month: 'ddd',
        week: 'ddd d',
        day: ''
      },
      axisFormat: 'H:mm',
      timeFormat: {
        '': 'H:mm',
        agenda: 'H:mm{ - H:mm}'
      },
      firstDay: 1,
      allDayText: "toute-la-journée",
//DATATABLE TRADUCTION
      sProcessing: "Traitement en cours...",
      sSearch: "Rechercher&nbsp;:",
      sLengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      sInfo: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      sInfoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      sInfoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      sInfoPostFix: "",
      sLoadingRecords: "Chargement en cours...",
      sZeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
      sEmptyTable: "Aucune donnée disponible dans le tableau",
      oPaginate: {
        sFirst: "Premier",
        sPrevious: "Pr&eacute;c&eacute;dent",
        sNext: "Suivant",
        sLast: "Dernier"
      },
      oAria: {
        sSortAscending: ": activer pour trier la colonne par ordre croissant",
        sSortDescending: ": activer pour trier la colonne par ordre décroissant"
      }
    };
  }
}

export default Bk;

