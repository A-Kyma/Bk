import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

let storagePath = Meteor.settings?.files?.storagePath;
const Files = new FilesCollection({
  debug: (Meteor.isServer)? true: false,
  collectionName: 'Files',
  allowClientCode: false,
  storagePath: storagePath,
});


if (Meteor.isServer) {
  Files.denyClient();

  // See server/files.js to check onAfterUpload event for creating thumbnails

  Meteor.publish('files.all', function () {
    return Files.find().cursor;
  });

  Meteor.publish('files.model',function(className,classId,field,indexes) {
    let search = {
      _id: { $in: indexes },
      "meta.className": className,
      "meta.classId": classId,
      "meta.field": field
    };
    return Files.find(search).cursor
  })
  /*
} else {
  Meteor.subscribe('files.all');
   */
}

export default Files;