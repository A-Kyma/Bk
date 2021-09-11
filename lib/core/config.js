const config = {
  guest: false,
  structure: false,
  webtype: "b2c",
  verbose: true,
  translation: {
    defaultLanguage: "en",
    helperName: "t",
    locales: ["en","fr","nl","de"]
  },
  account: {
    loginAfterSignup: true,

  },
  ui: "bootstrap",
  logs: {
    deprecation: true,
    nonExistingField: true,
    classDuplicate: true,
    typeDuplicate: true
  },
};

export default config;