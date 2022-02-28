import { Class as AstroClass } from 'meteor/jagi:astronomy'
import Files from "../../lib/classes/files";
import createThumbnails from "../utils/imageProcessing";

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
