import Files from "../../lib/classes/files";
import createThumbnails from "../utils/imageProcessing";

Files.on('afterUpload', function(fileRef) {
  if (/png|jpe?g/i.test(fileRef.extension || '')) {
    createThumbnails(this, fileRef, (error, fileRef) => {
      if (error) {
        console.error(error);
      }
    });
  }
})