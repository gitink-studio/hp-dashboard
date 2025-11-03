// import AWS from "aws-sdk";

export const uploadFileToS3 = async (file: File, key: string) => {
    // AWS.config.update({
    //     accessKeyId: process.env.S3_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    // });

    // const s3 = new AWS.S3({
    //     params: { Bucket: process.env.S3_BUCKET_NAME },
    //     region: process.env.S3_REGION,
    // });

    // const params: any = {
    //     Bucket: process.env.S3_BUCKET_NAME,
    //     Key: key,
    //     Body: file,
    // };

    // // Uploading file to s3
    // var upload = s3
    //     .putObject(params)
    //     .on("httpUploadProgress", (evt) => {
    //         console.log(
    //             "Uploading " + parseInt(((evt.loaded * 100) / evt.total).toString()) + "%"
    //         );
    //     })
    //     .promise();

    // await upload.then((err) => {
    //     console.log(err);
    //     alert("File uploaded successfully.");
    // });
}