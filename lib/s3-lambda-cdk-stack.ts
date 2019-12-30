import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');

export class S3LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'S3LambdaCdkQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'S3LambdaCdkTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
