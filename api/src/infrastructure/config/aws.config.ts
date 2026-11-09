import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export interface AwsConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

const getAwsConfig = (): AwsConfig => {
  const config: AwsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
  };
  return config;
};

export const configureDynamoDB = (): AWS.DynamoDB.DocumentClient => {
  const config = getAwsConfig();

  const awsConfig: AWS.ConfigurationOptions = {
    region: config.region,
  };

  if (config.accessKeyId && config.secretAccessKey) {
    awsConfig.credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
  }

  if (config.endpoint) {
    awsConfig.endpoint = config.endpoint;
  }

  AWS.config.update(awsConfig);

  return new AWS.DynamoDB.DocumentClient();
};

export const getDynamoDBTableName = (): string => {
  return process.env.DYNAMODB_TABLE_NAME || 'orders';
};

export const createDynamoDBClient = (): AWS.DynamoDB => {
  const config = getAwsConfig();

  const dynamoConfig: AWS.ConfigurationOptions = {
    region: config.region,
  };

  if (config.accessKeyId && config.secretAccessKey) {
    dynamoConfig.credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
  }

  if (config.endpoint) {
    dynamoConfig.endpoint = config.endpoint;
  }

  return new AWS.DynamoDB(dynamoConfig);
};