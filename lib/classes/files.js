import { Meteor }          from 'meteor/meteor'
import { FilesCollection } from 'meteor/ostrio:files'

let storagePath = Meteor.settings?.files?.storagePath;
const Files = new FilesCollection({
  debug: false, //Meteor.isServer,
  collectionName: 'Files',
  allowClientCode: false,
  storagePath: storagePath,
});

// See server/files.js to check onAfterUpload event for creating thumbnails
if (Meteor.isClient) {
  //Meteor.subscribe('files.all');
  /***
   * @memberOf Files
   * @name getStaticLink
   * @param {String} fileId - id of file in Files collection
   * @param {String} version - version of the file ("original" by default) - depend on field definition
   * @param {String} extension - extension of the file. Defaulted to jpg
   * @summary Get static link from file id in order to avoid any subscription or file cursor
   * @returns link to file
   */
  Files.getStaticLink = (fileId,version="original", extension="jpg") => {
    if (fileId === undefined) return
    return Meteor.absoluteUrl("/cdn/storage/Files/" + fileId + "/" + version + "/" + fileId + "." + extension)
  }
}

export default Files;