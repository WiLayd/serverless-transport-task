import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from 'src/lib/logger';
import { DynamoPaginationDto } from 'src/common/dto/pagination.dto';
import { decodeLastEvaluatedKey, encodeLastEvaluatedKey } from 'src/common/utils/dynamodb-helpers';
import { validateAndTransform } from 'src/common/utils/validation';
import { RouteListDto } from 'src/functions/routes/dto/response-dto/route-list.dto';
import { RouteItemType } from 'src/functions/routes/types/route.type';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.ROUTES_TABLE_NAME;

/**
 * @openapi
 * /dev/routes:
 *   get:
 *     summary: Get a list of routes
 *     tags:
 *       - Routes
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: lastEvaluatedKey
 *         in: query
 *         required: false
 *         description: Key to load the next page (base64)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the list of routes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteListDto'
 *       '400':
 *         description: Invalid request parameters.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const paginationDto = await validateAndTransform(
    DynamoPaginationDto,
    event.queryStringParameters,
  );

  const { limit, lastEvaluatedKey } = paginationDto;

  logger.info('Request received to fetch routes data', { tableName, limit, lastEvaluatedKey });

  const params: ScanCommandInput = {
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: decodeLastEvaluatedKey(lastEvaluatedKey),
  };

  const command = new ScanCommand(params);
  const result = await db.send(command);
  const itemCount = result.Items?.length ?? 0;

  logger.info(`Successfully fetched ${itemCount} routes from DynamoDB`);

  return new RouteListDto(
    result.Items as RouteItemType[],
    encodeLastEvaluatedKey(result.LastEvaluatedKey),
  );
};

export const handler = createHandler(baseHandler);
