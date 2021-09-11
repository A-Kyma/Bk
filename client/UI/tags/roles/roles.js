
Template.registerHelper("isRole", (access, model) => Role.is(access,model));

Template.registerHelper("isntRole", access => Role.isnt(access));

Template.registerHelper("isntAdminOrMe", function(user) {
  let userId = undefined;
  if (typeof user === "string") {
    userId = user;
  } else {
    userId = (user && user.id) || Meteor.userId();
  }
  return Role.isnt("Administrator") || (userId === Meteor.userId());
});