Package.describe({
  name: 'a-kyma:bk',
  version: '2.0.0',
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
  lodash: '4.17.20', // JS Library
  // to add meteor reactivity in vue : https://github.com/meteor-vue/vue-meteor-tracker
  "vue-meteor-tracker": "2.0.0-beta.5",
  // For Drag & Drop usage : https://github.com/kutlugsahin/vue-smooth-dnd
  "vue-smooth-dnd": "0.8.1",
  "gm": "1.23.1", // GraphicsMagick or ImageMagick for creating Thumbnails
});

// See https://guide.meteor.com/writing-atmosphere-packages.html
// Do a meteor update on the project while adding this package
Package.onUse(function(api) {
  api.versionsFrom('1.8.1');
  api.use('ecmascript'); // For ES6 javascript
  api.use('deps', 'client');
  api.use('tracker', 'client');
  api.use('meteor');
  api.use('mongo');
  api.use('check');
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('tmeasday:publish-counts'); // For datatable
  api.use('reywood:publish-composite'); // To enable multiple send in one subscription
  //api.use('ejson'); // Needed to .json files
  api.use('slaivyn:yaml'); // Needed to manage .yml files (for I18n)
  api.use('jagi:astronomy@2.7.3'); // Model management
  api.use('jagi:reactive-map@2.0.0'); // Used in errors management
  api.use('reactive-var'); // For clickTo... components and other thinks
  api.use('reactive-dict');
  api.use('ostrio:files') // For file upload

  // VueJS
  //api.use('akryum:vue'); // Vue and imported in NPM
  api.use('akryum:vue-component');
  api.use('akryum:vue-router2'); // See https://github.com/meteor-vue/vue-meteor/tree/master/packages/vue-router2
  //api.use('akryum:vue-ssr');

  //Blaze
  api.use('templating','client'); // to be able to create tag in package
  // Import Blaze UI tags and routes

  api.addFiles([
    'client/UI/ui.js',
  ],'client');

  //api.addFiles('%.css','client'); For CSS or SCSS files
  //api.addAssets(['%.eot','%.svg','%.ttf','%.woff'],'client'); // For other types of files

  // Load main modules
  api.mainModule('lib/lib.js');
  // Load client files
  api.addFiles('client/client.js','client');
  // Load server files
  api.addFiles('server/server.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('a-kyma:bk');
  api.mainModule('test/bk-tests.js');
});