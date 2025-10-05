Package.describe({
  name: 'akyma:bk',
  version: '2.1.44', // Use 'meteor publish --release=2.16' to update this version number
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
  "vue-meteor-tracker": "2.0.0",
  // For Drag & Drop usage : https://github.com/kutlugsahin/vue-smooth-dnd
  "@akyma/vue-smooth-dnd": "0.8.9",
  "vue-multiselect": "2.1.4",
  "vue2-teleport": "1.1.4", // Teleport for Vue 3 ported to Vue 2
  "gm": "1.23.1", // GraphicsMagick or ImageMagick for creating Thumbnails
  "chart.js": "2.9.4", // basic Chart js
  "vue-chartjs":"3.5.1", // Vue for Chart
  "xlsx":"0.18.4", //parse XLS
  "@vuese/cli":"2.14.3", //create vue documentation
  "js-yaml":"4.1.0", // for BkTranslations
  "luxon":"2.4.0", // for Date creation using timezone => See DateTime
  "chartjs-adapter-luxon":"1.1.0", // For chart js using date (axis type time)
  // // For rich text editor: https://tiptap.dev/docs/editor/getting-started/install/vue2
  "@tiptap/vue-2": "2.14.0",
  "@tiptap/pm": "2.14.0",
  "@tiptap/starter-kit": "2.14.0",
  "@tiptap/extension-image": "2.14.0",
  "@tiptap/extension-text-align": "2.14.0",
  "@tiptap/extension-link": "2.14.0",
  "@tiptap/extension-color": "2.14.0",
  "@tiptap/extension-text-style": "2.14.0",
  "@tiptap/extension-list-item": "2.14.0",
  //"quill": "2.0.3", // Rich text editor
  //"vue2-editor": "2.10.3", // Vue wrapper for quill-editor
});

// See https://guide.meteor.com/writing-atmosphere-packages.html
// Do a meteor update on the project while adding this package
Package.onUse(function(api) {
  api.versionsFrom('1.9.3','2.14');
  api.use('ecmascript'); // For ES6 javascript
  api.use('deps', 'client');
  api.use('tracker', 'client');
  api.use('meteor');
  api.use('mongo');
  api.use('check');
  api.use('accounts-base@1.5.0||2.0.1');
  api.use('accounts-password@1.5.2||2.0.1');
  api.use('tmeasday:publish-counts@0.8.0'); // For datatable
  api.use('reywood:publish-composite@1.3.6'); // To enable multiple send in one subscription
  //api.use('ejson'); // Needed to .json files
  api.use('slaivyn:yaml@1.0.1'); // Needed to manage .yml files (for I18n)
  api.use('jagi:astronomy@2.7.3'); // Model management
  api.use('jagi:reactive-map@2.0.0'); // Used in errors management
  api.use('reactive-var'); // For clickTo... components and other thinks
  api.use('reactive-dict')
  api.use('webapp','server')
  api.use('ostrio:files@2.3.2') // For file upload
  api.use('fetch'); // make http calls
  api.use('pfafman:filesaver@1.3.2'); // use SaveAs()
  api.use('jkuester:http@2.0.1') // to do http call (used for Deepl, radar)

  // VueJS
  //api.use('akryum:vue'); // Vue and imported in NPM
  api.use('akryum:vue-component@0.15.2');
  api.use('akryum:vue-router2@0.2.3'); // See https://github.com/meteor-vue/vue-meteor/tree/master/packages/vue-router2
  //api.use('akryum:vue-ssr');

  //Blaze
  api.use('templating@1.0.9','client'); // to be able to create tag in package
  // Import Blaze UI tags and routes

  api.addFiles([
    'client/UI/ui.js',
  ],'client');

  api.addFiles([
    'client/UI/tags/inputs/BkTextEditor.vue',
  ],'client')

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
  api.mainModule('lib/lib.js', ['client','server'])
  // Load client files
  api.addFiles('client/client.js','client');
  // Load server files
  api.addFiles('server/server.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('akyma:bk');
  api.mainModule('test/bk-tests.js');
});