import { S3Event } from 'aws-lambda'
// import papa from 'papaparse'
// import AWS from 'aws-sdk'

exports.handler = (event: S3Event) => {
    console.log('Incoming s3 event: ', JSON.stringify(event, null, 2))

    return 'You did it'
} 