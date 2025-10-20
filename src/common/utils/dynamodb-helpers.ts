import { logger } from 'src/lib/logger';

export const decodeLastEvaluatedKey = (
  lastEvaluatedKey?: string,
): Record<string, any> | undefined => {
  if (!lastEvaluatedKey) {
    return undefined;
  }

  try {
    const decodedString = Buffer.from(lastEvaluatedKey, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (error) {
    logger.error('Failed to parse lastEvaluatedKey', { error, key: lastEvaluatedKey });
    throw new Error('Invalid lastEvaluatedKey parameter.');
  }
};

export const encodeLastEvaluatedKey = (key?: Record<string, any>): string | undefined => {
  if (!key) {
    return undefined;
  }
  return Buffer.from(JSON.stringify(key)).toString('base64');
};

export const buildUpdateExpression = (dto: Record<string, any>) => {
  const validUpdates = Object.entries(dto).filter(([, value]) => value !== undefined);

  if (validUpdates.length === 0) {
    return {
      updateExpression: '',
      expressionAttributeValues: {},
      expressionAttributeNames: {},
    };
  }

  const updateExpression = 'SET ' + validUpdates.map(([key]) => `#${key} = :${key}`).join(', ');

  const expressionAttributeValues = validUpdates.reduce(
    (acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    },
    {} as Record<string, any>,
  );

  const expressionAttributeNames = validUpdates.reduce(
    (acc, [key]) => {
      acc[`#${key}`] = key;
      return acc;
    },
    {} as Record<string, string>,
  );

  return { updateExpression, expressionAttributeValues, expressionAttributeNames };
};
