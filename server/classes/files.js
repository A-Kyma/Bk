import { Class as AstroClass } from 'meteor/jagi:astronomy'
import Files from "../../lib/classes/files";
import createThumbnails from "../utils/imageProcessing";
import {Meteor} from "meteor/meteor";
//import { WebApp }          from 'meteor/webapp'

Files.denyClient();

/*
Meteor.publish('files.all', function () {
  return Files.find().cursor;
});
*/

Meteor.publish('files.model',function(className,classId,field,indexes) {
  let search = {
    _id: { $in: indexes },
    "meta.className": className,
    "meta.classId": classId,
    "meta.field": field
  };
  return Files.find(search).cursor
})

Files.on('afterUpload', function(fileRef) {
  let Class = AstroClass.get(fileRef.meta.className)
  let definition
  if (Class) {
    definition = Class.getDefinition(fileRef.meta.field)
  }
  if (/png|jpe?g/i.test(fileRef.extension || '')) {
    createThumbnails(this, fileRef, (error, fileRef) => {
      if (error) {
        console.error(error);
      } else {
        if (definition && definition.keepOriginal === false) {
          Files.unlink(fileRef,"original")
        }
      }
    });
  }
})

Files.collection.createIndex(
  {"meta.className": 1, "meta.classId": 1, "meta.field": 1},
  {name: "filesMeta", sparse: true}
)

/*
WebApp.connectHandlers.use((httpReq, httpResp, next) => {

})
*/