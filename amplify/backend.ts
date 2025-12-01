import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { fileConversion } from './function/file-conversion/resource';
import { mediaConversion } from './function/media-conversion/resource';
import { filterService } from './function/file-filter/resource';
import { audioFilter } from './function/audio-filter/resource';
import { shippingCost } from './function/shipping-cost/resource';
import { ratesFetcher } from './function/rates-fetcher/resource';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  fileConversion,
  filterService,
  mediaConversion,
  audioFilter,
  shippingCost,
  ratesFetcher
});

// Create Sharp Lambda Layer for native dependency support
const sharpLayer = new lambda.LayerVersion(
  backend.mediaConversion.resources.lambda,
  'SharpLayer',
  {
    code: lambda.Code.fromAsset(
      path.join(__dirname, '../lambda-layers/sharp-layer/sharp-layer.zip')
    ),
    compatibleRuntimes: [lambda.Runtime.NODEJS_20_X, lambda.Runtime.NODEJS_22_X],
    description: 'Sharp image processing library with Linux x64 binaries'
  }
);

// Add Sharp layer to media-conversion and file-filter functions
const mediaLambda = backend.mediaConversion.resources.lambda as lambda.Function;
const filterLambda = backend.filterService.resources.lambda as lambda.Function;

mediaLambda.addLayers(sharpLayer);
filterLambda.addLayers(sharpLayer);

// Get the ratesFetcher Lambda and data stack
const ratesFetcherLambda = backend.ratesFetcher.resources.lambda as lambda.Function;
const dataStack = backend.data.resources.cfnResources.cfnGraphqlApi.stack;

// Grant ratesFetcher Lambda access to MarketRate table
const marketRateTable = backend.data.resources.tables['MarketRate'];
marketRateTable.grantReadWriteData(ratesFetcherLambda);

// Add table name to Lambda environment
ratesFetcherLambda.addEnvironment('MARKET_RATE_TABLE', marketRateTable.tableName);

// Create EventBridge rule to trigger ratesFetcher every 1 minute (temporarily for initial data)
const ratesFetcherRule = new events.Rule(
  dataStack,
  'RatesFetcherSchedule',
  {
    schedule: events.Schedule.rate(Duration.minutes(30)),
    description: 'Trigger rates fetcher Lambda every 30 minute'
  }
);

ratesFetcherRule.addTarget(new targets.LambdaFunction(ratesFetcherLambda));



// Configure CloudWatch Logs for AppSync API (for resolver logging)
const cfnGraphqlApi = backend.data.resources.cfnResources.cfnGraphqlApi;

// Create IAM role for AppSync logging
const appSyncLoggingRole = new iam.Role(dataStack, 'AppSyncLoggingRole', {
  assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs')
  ]
});

// Create CloudWatch log group for AppSync
const appSyncLogGroup = new logs.LogGroup(dataStack, 'AppSyncLogGroup', {
  logGroupName: `/aws/appsync/apis/${cfnGraphqlApi.attrApiId}`,
  retention: logs.RetentionDays.ONE_WEEK,
  removalPolicy: RemovalPolicy.DESTROY
});

// Configure AppSync logging
cfnGraphqlApi.logConfig = {
  cloudWatchLogsRoleArn: appSyncLoggingRole.roleArn,
  fieldLogLevel: 'ALL',
  excludeVerboseContent: false
};
