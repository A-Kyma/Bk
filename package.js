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
  "fs.extra": "1.2.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.1');
  api.use('ecmascript');
  api.use('deps', 'client');
  api.use('tracker', 'client');
  api.use('meteor');
  api.use('mongo');
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('jagi:astronomy@2.4.8');
  api.mainModule('bk.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('a-kyma:bk');
  api.mainModule('bk-tests.js');
});
