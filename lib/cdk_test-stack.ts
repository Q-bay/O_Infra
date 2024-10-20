import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as path from 'path';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const functionName = 'my-hello-world-function';

    // 既存の Lambda 関数を削除するカスタムリソース
    const deleteLambda = new cr.AwsCustomResource(this, 'DeleteExistingLambda', {
      onUpdate: {
        service: 'Lambda',
        action: 'deleteFunction',
        parameters: {
          FunctionName: functionName,
        },
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new cdk.aws_iam.PolicyStatement({
          actions: ['lambda:DeleteFunction'],
          resources: [`arn:aws:lambda:${this.region}:${this.account}:function:${functionName}`],
        }),
      ]),
    });

    // 新しい Lambda 関数を作成
    const newLambda = new lambda.Function(this, 'HelloWorldFunction', {
      functionName: functionName,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'hello_world.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      // 必要に応じて他の設定を追加（環境変数、タイムアウト、メモリサイズなど）
    });

    // 削除が完了してから新しい関数を作成するように依存関係を設定
    newLambda.node.addDependency(deleteLambda);

    // 関数の ARN を出力
    new cdk.CfnOutput(this, 'LambdaFunctionArn', {
      value: newLambda.functionArn,
      description: 'ARN of the Lambda function',
    });
  }
}