//##################################################################################
//                                PUBLISH ROLE                                     #
//##################################################################################

Meteor.publish("myRoles", function() {
  if (!this.userId) { return this.ready() }
  return Roles.find({user: this.userId});
});

//In publish function, Meteor.userId() is not defined, we have to use this.userId instead
Meteor.publish("hisRoles", function(id) {
  if (!this.userId) { return this.ready() }
  if (Role.is("Administrator",undefined,this.userId) || (id === this.userId)) {
    return Roles.find({user: id});
  } else {
    return this.ready();
  }
});

Meteor.publish("adminRoles", function() {
  if (!this.userId) { return []; }
  if (Role.is("Administrator",undefined,this.userId)) {
    return Roles.find({access: {"$in": ["Administrator","SuperAdministrator"]}});
  } else {
    return this.ready();
  }
});