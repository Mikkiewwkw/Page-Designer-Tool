var aws = require("aws-sdk");
require("dotenv").config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey

const express = require("express");
const app = express();
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");
aws.config.update({
    region: "us-east-1", // Put your aws region here
    accessKeyId: "AKIAXKCRRSD3GJHJE65C",
    secretAccessKey: "0lBmJkb6hl885URDMhm+llobNp8WeYLjftjmiy02"
});
aws.config.setPromisesDependency(bluebird);

// const uploads3 = async (prefix, bucketName, fileName) => {
//     var presignedPUTURL = await s3.getSignedUrl("putObject", {
//         Bucket: bucketName,
//         Key: fileName, //filename
//         Prefix: prefix,
//         Expires: 300 //time to expire in seconds
//     });
//     return presignedPUTURL;
// };

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: "public-read",
        Body: buffer,
        Bucket: "max-client-logos",
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listenting on port ${port}`));
// Define POST route
// app.post("/image-upload", (request, response) =>
exports.handler = async (event, response) => {
    const presignedPUTURL = s3.getSignedUrl("putObject", {
        Bucket: event.queryStringParameters.bucketName,
        Key: event.queryStringParameters.name, //filename
        Prefix: event.queryStringParameters.prefix,
        ACL: "public-read",
        fileType: event.queryStringParameters.fileType,
        Expires: 300 //time to expire in seconds
    });

    const form = new multiparty.Form();
    form.parse(event, async (error, fields, files) => {
        if (error) throw new Error(error);
        try {
            console.log(files);
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `${files.file[0].fieldName}${files.file[0].originalFilename}${timestamp}`;
            const data = await uploadFile(buffer, fileName, type);
            return response.status(200).send(data);
        } catch (error) {
            return response.status(400).send(error);
        }
    });
};

console.log("Server up and running...");
// exports.sign_s3 = (bucketName, req, res) => {
//     const s3 = new aws.S3(); // Create a new instance of S3
//     const fileName = req.body.fileName;
//     const fileType = req.body.fileType;
//     // Set up the payload of what we are sending to the S3 api
//     const s3Params = {
//         Bucket: bucketName,
//         Key: fileName,
//         Expires: 500,
//         ContentType: fileType
//     };
//     // Make a request to the S3 API to get a signed URL which we can use to upload our file
//     s3.getSignedUrl("putObject", s3Params, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.json({ success: false, error: err });
//         }
//         // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
//         const returnData = {
//             signedRequest: data,
//             url: `https://${bucketName}.s3.amazonaws.com/${fileName}`
//         };
//         // Send it all back
//         res.json({ success: true, data: { returnData } });
//     });
// };
