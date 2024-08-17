import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Class as AstroClass } from 'meteor/akyma:astronomy'
import _noop from 'lodash/noop';

// See https://github.com/veliovgroup/meteor-files-website/blob/master/imports/server/image-processing.js

import fs from 'fs-extra';
import gm from 'gm';
//Some platforms may bundle ImageMagick into their tools (like Heroku). In this case you may use GraphicsMagick as Imagemagick in this way:
//npm install gm --save and then where you use it:
//const gm = require('gm');
//const im = gm.subClass({ imageMagick: true });
//Please note that GM was considered slightly faster than IM so before you chose convenience over performance read the latest news about it.
//https://mazira.com/blog/comparing-speed-imagemagick-graphicsmagick

const bound = Meteor.bindEnvironment((callback) => {
  return callback();
});

const createThumbnails = (collection, fileRef, cb) => {
  check(fileRef, Object);

  let isLast = false;
  const finish = (error) => {
    bound(() => {
      if (error) {
        console.error('[_app.createThumbnails] [finish]', error);
        cb && cb (error);
      } else {
        console.log('[ImageProcessing] Done');
        if (isLast) {
          cb && cb(void 0, fileRef);
        }
      }
      return true;
    });
  };

  fs.exists(fileRef.path, (exists) => {
    bound(() => {
      if (!exists) {
        throw Meteor.log.error('File ' + fileRef.path + ' not found in [createThumbnails] Method');
      }

      const image = gm(fileRef.path);

      let sizes
      let Class = AstroClass.get(fileRef.meta.className)
      if (Class) {
        let definition = Class.getDefinition(fileRef.meta.field)
        sizes = definition.sizes
      }
      if (!sizes) {
        sizes = Meteor.settings.files && Meteor.settings.files.sizes || {
          sd: {
            width: 1024
          },
          thumbnail: {
            width: 100,
            //square: true
          }
        }
      };

      image.size((error, features) => {
        bound(() => {
          if (error) {
            console.error('[_app.createThumbnails] [_.each sizes]', error);
            cb && cb(Meteor.Error('[_app.createThumbnails] [image.size]', error));
            return;
          }

          let i = 0;
          // Update meta data if original image
          collection.collection.update(fileRef._id, {
            $set: {
              'meta.width': features.width,
              'meta.height': features.height,
              'versions.original.meta.width': features.width,
              'versions.original.meta.height': features.height
            }
          },_noop);

          Object.keys(sizes).forEach((name) => {
            const size = sizes[name];
            const path = (collection.storagePath(fileRef)) + '/' + name + '-' + fileRef._id + '.' + fileRef.extension;
            const copyPaste = () => {
              fs.copy(fileRef.path, path, (fsCopyError) => {
                bound(() => {
                  if (fsCopyError) {
                    console.error('[_app.createThumbnails] [forEach sizes] [fs.copy]', fsCopyError);
                    finish(fsCopyError);
                    return;
                  }

                  const upd = { $set: {} };
                  upd.$set[`versions.${name}`] = {
                    path: path,
                    size: fileRef.size,
                    type: fileRef.type,
                    extension: fileRef.extension,
                    meta: {
                      width: features.width,
                      height: features.height
                    }
                  };

                  console.log('[ImageProcessing] Updating collection for size '+size);
                  collection.collection.update(fileRef._id, upd, (colUpdError) => {
                    ++i;
                    if (i === Object.keys(sizes).length) {
                      isLast = true;
                    }
                    finish(colUpdError);
                    console.log('[ImageProcessing] Done size '+size);
                  });
                });
              });
            }

            if (/png|jpe?g/i.test(fileRef.extension)) {
              const img = gm(fileRef.path)
                .quality(90)
                .define('filter:support=2')
                .define('jpeg:fancy-upsampling=false')
                .define('jpeg:fancy-upsampling=off')
                .define('png:compression-filter=5')
                .define('png:compression-level=8')
                .define('png:compression-strategy=1')
                .define('png:exclude-chunk=all')
                .autoOrient()
                .noProfile()
                .strip()
                .dither(false)
                .interlace('Line')
                .filter('Cubic');

              const updateAndSave = (upNSaveError) => {
                bound(() => {
                  if (upNSaveError) {
                    console.error('[_app.createThumbnails] [forEach sizes] [img.resize]', upNSaveError);
                    finish(upNSaveError);
                    return;
                  }
                  fs.stat(path, (fsStatError, stat) => {
                    bound(() => {
                      if (fsStatError) {
                        console.error('[_app.createThumbnails] [forEach sizes] [img.resize] [fs.stat]', fsStatError);
                        finish(fsStatError);
                        return;
                      }

                      gm(path).size((gmSizeError, imgInfo) => {
                        bound(() => {
                          if (gmSizeError) {
                            console.error('[_app.createThumbnails] [forEach sizes] [img.resize] [fs.stat] [gm(path).size]', gmSizeError);
                            finish(gmSizeError);
                            return;
                          }
                          const upd = { $set: {} };
                          upd.$set[`versions.${name}`] = {
                            path: path,
                            size: stat.size,
                            type: fileRef.type,
                            extension: fileRef.extension,
                            name: fileRef.name,
                            meta: {
                              width: imgInfo.width,
                              height: imgInfo.height
                            }
                          };

                          collection.collection.update(fileRef._id, upd, (colUpdError) => {
                            ++i;
                            if (i === Object.keys(sizes).length) {
                              isLast = true;
                            }
                            finish(colUpdError);
                          });
                        });
                      });
                    });
                  });
                });
              };

              if (!size.square && !size.squareExtent) {
                if (features.width > size.width) {
                  if (size.height) {
                    // Check ratio
                    const widthRatio  = features.width / size.width;
                    const heightRatio = features.height / size.height;
                    let x = 0;
                    let y = 0;
                    let widthNew      = size.width;
                    let heightNew     = size.height;

                    // If height ratio lower
                    if (heightRatio < widthRatio) {
                      widthNew = features.width * size.height / features.height;
                      x = (widthNew - size.width) / 2;
                    }

                    if (heightRatio > widthRatio) {
                      heightNew = features.height * size.width / features.width;
                      y = (heightNew - size.height) / 2;
                    }

                    img.resize(widthNew,heightNew)
                      .crop(size.width, size.height, x, y)
                      .interlace('Line')
                      .write(path, updateAndSave);

                  } else {
                    // resize at best effort
                    img.resize(size.width).interlace('Line').write(path, updateAndSave);
                  }
                } else {
                  copyPaste();
                }
              } else if (size.square) {
                // square cropped
                let x = 0;
                let y = 0;
                const widthRatio  = features.width / size.width;
                const heightRatio = features.height / size.width;
                let widthNew      = size.width;
                let heightNew     = size.width;

                if (heightRatio < widthRatio) {
                  widthNew = (size.width * features.width) / features.height;
                  x = (widthNew - size.width) / 2;
                }

                if (heightRatio > widthRatio) {
                  heightNew = (size.width * features.height) / features.width;
                  y = (heightNew - size.width) / 2;
                }

                img
                  .resize(widthNew, heightNew)
                  .crop(size.width, size.width, x, y)
                  .interlace('Line')
                  .write(path, updateAndSave);
              } else {
                // Square border added
                const widthRatio  = features.width / size.width;
                const heightRatio = features.height / size.width;
                let widthNew      = size.width;
                let heightNew     = size.width;

                if (heightRatio < widthRatio) {
                  heightNew = (size.width * features.height) / features.width;
                }

                if (heightRatio > widthRatio) {
                  widthNew = (size.width * features.width) / features.height;
                }

                img
                  .resize(widthNew, heightNew)
                  .gravity('Center')
                  .extent(size.width,size.width)
                  .interlace('Line')
                  .transparent("white")
                  .write(path, updateAndSave);
              }
            } else {
              copyPaste();
            }
          });
        });
      });
    });
  });
  return true;
};

export default createThumbnails;