import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const Files = new FilesCollection({
  debug: true,
  collectionName: 'Files',
  allowClientCode: false,

});


if (Meteor.isServer) {
  Files.denyClient();
/*
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
} else {
  Meteor.subscribe('files.images.all');
*/
}

export default Files;