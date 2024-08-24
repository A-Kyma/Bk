Package.describe({
  name: 'akyma:bk',
  version: '3.0.0',
  // Brief, one-line summary of the package.
  summary: 'Package which helps creating web applications',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/A-Kyma/Bk',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "fs.extra": "1.3.2", // Used for file system read. Needed for creating thumbnails
  lodash: '4.17.21', // JS Library
  // to add meteor reactivity in vue : https://github.com/meteor-vue/vue-meteor-tracker
  "vue-meteor-tracker": "3.0.0-beta.7",
  // For Drag & Drop usage : https://github.com/kutlugsahin/vue-smooth-dnd
  "vue-smooth-dnd": "0.8.1",
  "vue-multiselect": "2.1.4", // 3.0.0 for Vue 3
  "gm": "1.25.0", // GraphicsMagick or ImageMagick for creating Thumbnails
  "chart.js": "4.4.3", // basic Chart js
  "vue-chartjs":"5.3.1", // Vue for Chart
  "xlsx":"0.18.5", //parse XLS
  "@vuese/cli":"2.14.3", //create vue documentation
  "js-yaml":"4.1.0", // for BkTranslations
  "luxon":"3.5.0", // for Date creation using timezone => See DateTime
  "chartjs-adapter-luxon":"1.3.1", // For chart js using date (axis type time)
  //"vite": "5.4.1",
  "vue": "3.3.9"
});


// See https://guide.meteor.com/writing-atmosphere-packages.html
// Do a meteor update on the project while adding this package
Package.onUse(function(api) {
  api.versionsFrom(['2.16','3.0']);
  api.use('ecmascript'); // For ES6 javascript
  api.use('deps', 'client');
  api.use('tracker', 'client');
  api.use('meteor');
  api.use('mongo');
  api.use('check');
  api.use('accounts-base@1.5.0 || 2.2.11 || 3.0.0');
  api.use('accounts-password@1.5.2 || 2.4.0 || 3.0.0');
  api.use('akyma:publish-counts@1.0.1'); // For datatable
  api.use('reywood:publish-composite@1.8.9'); // To enable multiple send in one subscription
  //api.use('ejson'); // Needed to .json files
  api.use('akyma:yaml@2.0.1'); // Needed to manage .yml files (for I18n) replaced by ViteJS YAML plugin on client side
  api.use('akyma:astronomy@3.0.2'); // Model management
  api.use('jagi:reactive-map@2.0.0'); // Used in errors management
  api.use('reactive-var'); // For clickTo... components and other thinks
  api.use('reactive-dict')
  api.use('webapp@2.0.0','server')
  api.use('ostrio:files@3.0.0-beta.4') // For file upload
  api.use('fetch'); // make http calls
  api.use('pfafman:filesaver@1.3.2'); // use SaveAs()
  api.use('jkuester:http@2.0.1') // to do http call (used for Deepl, radar)
  api.use('jorgenvatle:vite-bundler@2.0.1')

  // VueJS
  //api.use('akryum:vue'); // Vue and imported in NPM
  //api.use('akryum:vue-component@0.15.2');
  //api.use('akryum:vue-router2@0.2.3'); // See https://github.com/meteor-vue/vue-meteor/tree/master/packages/vue-router2
  //api.use('akryum:vue-ssr');

  //Blaze
  //api.use('templating@1.4.4','client'); // to be able to create tag in package
  // Import Blaze UI tags and routes

  // api.addFiles([
  //   'client/UI/ui.js',
  // ],'client');

  //api.addFiles('%.css','client'); For CSS or SCSS files
  //api.addAssets(['%.eot','%.svg','%.ttf','%.woff'],'client'); // For other types of files
  api.addAssets(['client/UI/flags/de.svg'],'client') // For svg flags
  api.addAssets(['client/UI/flags/es.svg'],'client')
  api.addAssets(['client/UI/flags/fr.svg'],'client')
  api.addAssets(['client/UI/flags/gb.svg'],'client')
  api.addAssets(['client/UI/flags/it.svg'],'client')
  api.addAssets(['client/UI/flags/nl.svg'],'client')

  api.addAssets(['client/UI/flags/1x1/de.svg'],'client') // For svg flags in 1x1 format
  api.addAssets(['client/UI/flags/1x1/es.svg'],'client')
  api.addAssets(['client/UI/flags/1x1/fr.svg'],'client')
  api.addAssets(['client/UI/flags/1x1/gb.svg'],'client')
  api.addAssets(['client/UI/flags/1x1/it.svg'],'client')
  api.addAssets(['client/UI/flags/1x1/nl.svg'],'client')
  // Load main modules
  api.mainModule('lib/lib.js')
  // Load client files
  api.addFiles('client/client.js','client');
  // api.addFiles('client/UI/BkUI.js','client',{lazy:true});
  // Load server files
  api.addFiles('server/server.js','server');
  api.addAssets(['client/UI/tags/forms/BkLabel.vue'],'client')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('akyma:bk');
  api.mainModule('test/bk-tests.js');
});