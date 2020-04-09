import BkLib from "../../lib/utils/BkLib";

export default class BkServerCore extends BkLib {
  constructor() {
    super();
    this.RootPath = "./../../..";

    this.FilePath = process.env.PRIVATE_FOLDER ? process.env.PRIVATE_FOLDER : BkServerCore.RootPath + "/private/system";
  }

  static string2class(name) {
    let klass;
    const s = BkServerCore.sanitizedString(name);
    try {
      klass = eval(s);
    } catch (e) {
      return;
    }
    return klass;
  }

  static sanitizedString(s) {
    if (typeof s !== "string") { return ""; }
    return s.replace(/[^a-zA-Z0-9_\.-]/g, "");
  }

  static searchUserByEmail(email) {
    let id, pswAccount;
    if (email.indexOf('@gmail') > 0) {
      const gmailAccount = Meteor.users.find({'services.google.email': email}).fetch();
      if (gmailAccount.length === 1) {
        id = gmailAccount[0]._id;
      } else {
        pswAccount = Accounts.findUserByEmail(email);
        if (pswAccount !== undefined) {
          id = pswAccount._id;
        }
      }
    } else {
      pswAccount = Accounts.findUserByEmail(email);
      if (pswAccount !== undefined) {
        id = pswAccount._id;
      }
    }
    return id;
  }
}