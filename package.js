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
  "fs.extra": "1.2.1",
  lodash: '4.17.4',
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
  //api.use('ejson'); // Needed to .json files
  api.use('slaivyn:yaml'); // Needed to manage .yml files (for I18n)
  api.use('jagi:astronomy@2.7.3'); // Model management
  api.use('jagi:reactive-map@2.0.0'); // Used in errors management
  api.use('reactive-var'); // For clickTo... components and other thinks

  // VueJS
  //api.use('akryum:vue'); // Vue and imported in NPM
  api.use('akryum:vue-component');
  //api.use('akryum:vue-ssr');

  //Blaze
  api.use('templating','client'); // to be able to create tag in package
  // Import Blaze UI tags and routes
  api.addFiles([
    'client/UI/ui.js',
  ],'client');

  //api.addFiles('%.css','client'); For CSS or SCSS files
  //api.addAssets(['%.eot','%.svg','%.ttf','%.woff'],'client'); // For other types of files

  api.mainModule('client/client.js','client');
  api.mainModule('server/server.js','server');
  api.mainModule('lib/lib.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('a-kyma:bk');
  api.mainModule('test/bk-tests.js');
});