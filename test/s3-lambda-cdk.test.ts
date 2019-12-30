import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import S3LambdaCdk = require('../lib/s3-lambda-cdk-stack');

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new S3LambdaCdk.S3LambdaCdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new S3LambdaCdk.S3LambdaCdkStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});