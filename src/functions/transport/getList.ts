import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from 'src/lib/logger';
import { DynamoPaginationDto } from 'src/common/dto/pagination.dto';
import { decodeLastEvaluatedKey, encodeLastEvaluatedKey } from 'src/common/utils/dynamodb-helpers';
import { validateAndTransform } from 'src/common/utils/validation';
import { TransportListDto } from 'src/functions/transport/dto/response-dto/transport-list.dto';
import { TransportItemType } from 'src/functions/transport/types/transport.type';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.TRANSPORT_TABLE_NAME;

/**
 * @openapi
 * /dev/transport:
 *   get:
 *     summary: Get a list of transport
 *     tags:
 *       - Transport
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
 *         description: Successful response with the list of transport.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransportListDto'
 *       '400':
 *         description: Invalid request parameters.
 */
const baseHandler = async (event: APIGatewayProxyEvent) => {
  const paginationDto = await validateAndTransform(
    DynamoPaginationDto,
    event.queryStringParameters,
  );

  const { limit, lastEvaluatedKey } = paginationDto;

  logger.info('Request received to fetch transport data', { tableName, limit, lastEvaluatedKey });

  const params: ScanCommandInput = {
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: decodeLastEvaluatedKey(lastEvaluatedKey),
  };

  const command = new ScanCommand(params);
  const result = await db.send(command);
  const itemCount = result.Items?.length ?? 0;

  logger.info('Successfully fetched transport data from DynamoDB', { itemCount });

  return new TransportListDto(
    result.Items as TransportItemType[],
    encodeLastEvaluatedKey(result.LastEvaluatedKey),
  );
};

export const handler = createHandler(baseHandler);
