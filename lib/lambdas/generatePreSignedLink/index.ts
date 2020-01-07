import AWS = require('aws-sdk')

const s3 = new AWS.S3({
    signatureVersion: 'v4',
})

import { v4 } from "uuid"

exports.handler = async () => {
    const url = await s3.getSignedUrlPromise('putObject', { Bucket: process.env.targetS3Bucket, Key: `${v4()}`, ContentType: 'text/csv' })
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: url
    }
}