import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3')
import lambda = require('@aws-cdk/aws-lambda')
import lamdaEvents = require('@aws-cdk/aws-lambda-event-sources')
import apigateway = require('@aws-cdk/aws-apigateway')

import path = require('path')
import { Duration } from '@aws-cdk/core';

export class S3LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productCSVBucket = new s3.Bucket(this, 'product-csv-upload')

    const productCSVParser = new lambda.Function(this, 'parseCSVIntoSqsTopics', {
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(60),
      memorySize: 2048,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'parseCSVIntoSqsTopics'))
    })

    const getSignedS3URL = new lambda.Function(this, 'getSignedS3URL', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'generatePreSignedLink')),
      environment: {
        targetS3Bucket: productCSVBucket.bucketName
      }
    })

    productCSVBucket.grantReadWrite(getSignedS3URL)
    productCSVBucket.grantRead(productCSVParser)

    new apigateway.LambdaRestApi(this, 'product', {
      handler: getSignedS3URL,
    })

    productCSVParser.addEventSource(new lamdaEvents.S3EventSource(productCSVBucket, { events: [s3.EventType.OBJECT_CREATED_PUT] }))

  }
}
