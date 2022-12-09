const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class S3Controller {
    async generateURL() {
        const bucketParams = {
            Bucket: `${process.env.BUCKET}`,
            Key: `${process.env.BUCKET}-${Math.ceil(Math.random() * 10 ** 10)}`,
            ACL: 'public-read'
        };

        const s3Client =  new S3Client({
            region: process.env.REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        });
        // Create a command to put the object in the S3 bucket.
        const command = new PutObjectCommand(bucketParams);
        // Create the presigned URL.
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
        });

        console.log(signedUrl);

        return { signedUrl, originalUrl: `https://${process.env.BUCKET}.s3.amazonaws.com/${bucketParams.Key}`};
    }
}

module.exports = new S3Controller();