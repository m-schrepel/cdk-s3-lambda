import AWS = require('aws-sdk')
import { APIGatewayEvent } from 'aws-lambda'
const s3 = new AWS.S3()

exports.handler = async (event: APIGatewayEvent) => {
    const url = await s3.getSignedUrlPromise('putObject', { Bucket: 'product-csv-upload', Key: 'product-upload.csv', Expires: 3600, ContentLength: 15683929 })
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Your presigned link is ${url}`
    }
}