import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'eu-central-1',
  endpoint: undefined,
});

export const db = DynamoDBDocumentClient.from(client);
