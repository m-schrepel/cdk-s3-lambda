#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { S3LambdaCdkStack } from '../lib/s3-lambda-cdk-stack';

const app = new cdk.App();
new S3LambdaCdkStack(app, 'S3LambdaCdkStack');