const AWS = require("aws-sdk");
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: process.env.AWS_REGION
});

exports.uploadFileBySignedURL = function uploadFileBySignedURL(keyPath) {
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keyPath,
    Expires: 300
  };

  return Promise.resolve(s3.getSignedUrl('putObject', params));
}

exports.buildS3Url = function buildS3Url(keyPath) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  
  return `https://s3.${region}.amazonaws.com/${bucketName}/${keyPath}`;
}

exports.deleteObjectByKey = function deleteObjectByKey(keyPath) {
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keyPath
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
