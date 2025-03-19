const awsSdk = require("aws-sdk");
const sharp = require("sharp");
const path = require("path");

const BUCKET_NAME = "imb-brunswick";
const PICTURE_WIDTH = 512;
const PICTURE_HEIGHT = 512;

awsSdk.config.loadFromPath(`${path.join(__dirname, "/config")}/s3_utils.json`);

const s3Bucket = new awsSdk.S3({ params: { Bucket: BUCKET_NAME } });

module.exports = {
  addPicture: picture => {
    sharp(picture.data)
      .resize(PICTURE_WIDTH, PICTURE_HEIGHT)
      .toBuffer()
      .then(processedPicture => {
        const data = {
          Key: picture.name,
          Body: processedPicture,
          ContentType: picture.mimetype,
          ACL: "public-read"
        };
        s3Bucket.putObject(data, resp => {
          console.log(resp);
          console.log("Successfully uploaded package.");
        });
      });

    return "done";
  }
};
