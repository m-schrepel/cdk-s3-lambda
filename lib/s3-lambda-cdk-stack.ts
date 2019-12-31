import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3')
import s3n = require('@aws-cdk/aws-s3-notifications')

export class S3LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productCSVBucket = new s3.Bucket(this, 'product-csv-upload')

  }
}
