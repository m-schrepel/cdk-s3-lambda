import AWS = require('aws-sdk')
import { APIGatewayEvent } from 'aws-lambda'
const s3 = new AWS.S3({
    signatureVersion: 'v4',
})
import { v4 } from "uuid"

exports.handler = async (event: APIGatewayEvent) => {
    const url = await s3.getSignedUrlPromise('putObject', { Bucket: process.env.targetS3Bucket, Key: `${v4()}`, ContentType: 'text/csv' })
    console.log(url)
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: url
    }
}