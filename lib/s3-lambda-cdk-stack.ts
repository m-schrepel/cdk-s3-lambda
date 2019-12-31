import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3')
import lambda = require('@aws-cdk/aws-lambda')
import lamdaEvents = require('@aws-cdk/aws-lambda-event-sources')
import path = require('path')

export class S3LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productCSVBucket = new s3.Bucket(this, 'product-csv-upload')
    
    const productCSVParser = new lambda.Function(this, 'parseCSVIntoSqsTopics', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'parseCSVIntoSqsTopics'))
    })

    productCSVParser.addEventSource(new lamdaEvents.S3EventSource(productCSVBucket, { events: [s3.EventType.OBJECT_CREATED_PUT] }))

  }
}
