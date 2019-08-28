var AWS = require("aws-sdk");
const s3 = new AWS.S3();
s3.config.update({
    accessKeyId: "AKIAXKCRRSD3GJHJE65C",
    secretAccessKey: "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",
    region: "us-west-2"
});

async function listAllKeys(params, outputArray) {
    try {
        const response = await s3.listObjectsV2(params).promise();
        response.Contents.forEach(obj => outputArray.push(obj.Key));

        if (response.IsTruncated) {
            const newParams = Object.assign({}, params);
            newParams.ContinuationToken = response.NextContinuationToken;
            await listAllKeys(newParams, outputArray); // RECURSIVE CALL
        }
    } catch (error) {
        throw error;
    }
    // s3.listObjectsV2(params, function(err, data) {
    //     if (err) {
    //         console.log(err, err.stack);
    //     } else {
    //         var contents = data.Contents;
    //         contents.forEach(function(content) {
    //             allKeys.push(content.Key);
    //             console.log("1", allKeys);
    //         });
    //
    //         if (data.IsTruncated) {
    //             params.ContinuationToken = data.NextContinuationToken;
    //             console.log("There are more keys coming up");
    //             listAllKeys();
    //         }
    //     }
    // });
}

const downloadS3 = async (prefix, bucketName) => {
    let allKeys = [];
    const params = {
        Bucket: bucketName,
        Delimiter: "/",
        Prefix: prefix,
        StartAfter: prefix
    };

    await listAllKeys(params, allKeys);
    // var nodesArray = [].slice.call(allKeys);
    // console.log(typeof nodesArray);
    // console.log("elements", nodesArray);

    // allKeys.map(key => s3.getSignedUrl('getObject', {Bucket:bucketName,Key:key}, function (err, url) {
    //     return url;
    // });
    //
    //   var urlparams = {Bucket: 'max-client-logos', Key: allKeys[0]};
    //   s3.getSignedUrl('getObject', urlparams, function (err, url) {
    //     console.log('Your generated pre-signed URL is', url);
    // });
    //   let url = allKeys.map((key) => (s3.getSignedUrl('getObject', {
    //     Bucket:"max-client-logos",
    //     Key:key
    //   }, function(err, url) {
    //     console.log('Your generated pre-signed URL is', url);
    //   }
    // )));
    return allKeys;
};

export default downloadS3;
