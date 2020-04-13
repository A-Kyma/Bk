import Bk from "../../lib/utils/BkLib";

Bk.RootPath = "./../../..";

Bk.FilePath = process.env.PRIVATE_FOLDER ? process.env.PRIVATE_FOLDER : Bk.RootPath + "/private/system";

Bk.string2class = function (name) {
  let klass;
  const s = Bk.sanitizedString(name);
  try {
    klass = eval(s);
  } catch (e) {
    return;
  }
  return klass;
}

Bk.sanitizedString = function (s) {
  if (typeof s !== "string") {
    return "";
  }
  return s.replace(/[^a-zA-Z0-9_\.-]/g, "");
}

Bk.searchUserByEmail = function (email) {
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