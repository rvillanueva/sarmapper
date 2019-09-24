const AWS = require('aws-sdk');
const config = new AWS.Config();
const region = 'us-east-1';
config.update({region});
const s3 = new AWS.S3();

async function clearBucket(bucketName) {
  const data = await listObjects(bucketName);
  const keys = data.Contents.map(obj => obj.Key);
  return deleteObjects(bucketName, keys);
}

function listObjects(bucketName) {
  return new Promise((resolve, reject) => {
    var params = {
     Bucket: bucketName,
     MaxKeys: 100
    };
    s3.listObjects(params, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  })
}

function deleteObjects(bucketName, keys) {
  return new Promise((resolve, reject) => {
    if(!keys || keys.length === 0) {
      resolve();
    }
    var params = {
      Bucket: bucketName,
      Delete: {
        Objects: keys.map(key => ({Key: key})),
        Quiet: false
      }
    };
    s3.deleteObjects(params, function(err, data) {
      let failure = err;
      if(!err && data.Errors && data.Errors.length > 0) {
        failure = data.Errors;
      }
      if (failure) {
        return reject(failure)
      };
      resolve(data);
    });
  })
}

function uploadFile(uploadParams) {
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, {}, function(err, data) {
      if(err) return reject(err);
      resolve(data);
    });
  })
}

module.exports = {
  listObjects: listObjects,
  deleteObjects: deleteObjects,
  clearBucket: clearBucket,
  uploadFile: uploadFile,
  region
}
