import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as python from '@aws-cdk/aws-lambda-python-alpha';
import * as path from 'path';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda 関数の定義
    new python.PythonFunction(this, 'HelloWorldFunction', {
      functionName: 'my-hello-world-function', // この行を追加
      entry: path.join(__dirname, '../lambda'),
      index: 'hello_world.py',
      handler: 'handler',
      runtime: lambda.Runtime.PYTHON_3_9,
    });
  }
}