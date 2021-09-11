import Role from "../../lib/classes/role";
//##################################################################################
//                                PUBLISH ROLE                                     #
//##################################################################################

//Subscribe automatically to my role ?
Meteor.publish("myRoles", function() {
  if (!this.userId) { return this.ready() }
  return Role.getCollection().find({user: this.userId});
});

//In publish function, Meteor.userId() is not defined, we have to use this.userId instead
Meteor.publish("hisRoles", function(id) {
  if (!this.userId) { return this.ready() }
  if (Role.is("Administrator",undefined,this.userId) || (id === this.userId)) {
    return Role.getCollection().find({user: id});
  } else {
    return this.ready();
  }
});

Meteor.publish("adminRoles", function() {
  if (!this.userId) { return this.ready(); }
  if (Role.is("Administrator",undefined,this.userId)) {
    return Role.getCollection().find({access: {"$in": ["Administrator","SuperAdministrator"]}});
  } else {
    return this.ready();
  }
});