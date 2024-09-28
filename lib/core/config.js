const config = {
  guest: false,
  structure: false,
  webtype: "b2c",
  verbose: true,
  translation: {
    defaultLanguage: "en",
    helperName: "t",
    locales: ["en","fr","nl","de"],
    deeplKey: "6664a594-99cd-3854-4524-7d287755af0d:fx"
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
  export: {
    xls: {
      parameterTable: "ExcelExport"
    }
  }
};

export default config;