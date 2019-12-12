import * as functions from 'firebase-functions';
const path  = require("path");
const os  = require("os");
const mkdirp  = require("mkdirp-promise");
const spawn = require('child-process-promise').spawn;
const {Storage} = require('@google-cloud/firestore');

const gcs = new Storage();


export const resizeThumbnail = functions.storage.object()
    .onFinalize( async (object, context) => {
        const fileFullPath = object.name || '', 
                         contentType = object.contentType || '',
                         fileDir = path.dirname(fileFullPath),
                         fileName = path.basename(fileFullPath),

                         tempLocalDir = path.join(os.tmpdir(),fileDir);
    console.log('Thnmbnail generation started', fileFullPath,fileDir, fileName);
    
        if(!contentType.startsWith("image/")) {
            console.log('Exiting image processing');            
            return null;
        }
       await mkdirp(tempLocalDir);
       const bucket = gcs.bucket(object.bucket);
       const originalImageFike = bucket.file(fileFullPath);
       const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
       console.log('doawloadif image to',tempLocalFile);
       await originalImageFike.download({destination: tempLocalFile});


       //generte thumbnail

       const outFilePath = path.join(fileDir, 'thumb_' + fileName);
       const outFile = path.join(os.tmpdir(), outFilePath);
       console.log('generati a thumbnil to: ', outFile);
       
      await  spawn('convert',[tempLocalFile,"-thumbnail","510x287>", outFile],
            {capture: ['stdout','stderr']});

      // upload 

      const metadata = {
          contentType: object.contentType,
          cacheControl: 'public,max-age=2592000, s-maxage=2592000'
      };

      console.log('Deploying the tuhmnail to storage:', outFilePath, outFilePath);

      await bucket.upload(outFile, {destination: outFilePath, metadata});
      




        return null;
    });