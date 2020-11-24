import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const Files = new FilesCollection({
  debug: false,
  collectionName: 'Files',
  allowClientCode: false,

});


if (Meteor.isServer) {
  Files.denyClient();

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