import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { logger } from 'src/lib/logger';
import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { TransportStatusEnum } from 'src/common/enums/transport.enum';
import { validateAndTransform } from 'src/common/utils/validation';
import { AssignTransportDto } from 'src/functions/routes/dto/request-dto/assign-transport.dto';
import { RouteDto } from 'src/functions/routes/dto/response-dto/route.dto';
import { RouteItemType } from 'src/functions/routes/types/route.type';
import { TransportItemType } from 'src/functions/transport/types/transport.type';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';
import { CurrencyService } from 'src/services/currency.service';

const routesTableName = process.env.ROUTES_TABLE_NAME;
const transportTableName = process.env.TRANSPORT_TABLE_NAME;

/**
 * @openapi
 * /dev/routes/{routeId}/assign:
 *   post:
 *     summary: Assign transport to a route and calculate cost
 *     tags:
 *       - Routes
 *     parameters:
 *       - name: routeId
 *         in: path
 *         required: true
 *         description: The UUID of the route to which the transport will be assigned.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: The ID of the transport to be assigned.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTransportDto'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteDto'
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const routeId = event.pathParameters?.id;
  if (!routeId) {
    throw new HttpError(400, 'routeId path parameter is required.');
  }
  if (!event.body) {
    throw new HttpError(400, 'Request body is missing');
  }

  const { transportId } = await validateAndTransform(AssignTransportDto, JSON.parse(event.body));

  const [routeResult, transportResult] = await Promise.all([
    db.send(new GetCommand({ TableName: routesTableName, Key: { id: routeId } })),
    db.send(new GetCommand({ TableName: transportTableName, Key: { id: transportId } })),
  ]);

  const route = routeResult.Item as RouteItemType;
  const transport = transportResult.Item as TransportItemType;

  if (!route) {
    throw new HttpError(404, 'Route not found.');
  }
  if (!transport) {
    throw new HttpError(404, 'Transport not found.');
  }

  if (route.status !== RouteStatusEnum.PENDING) {
    throw new HttpError(400, `Route is not in PENDING state. Current state: ${route.status}`);
  }
  if (transport.status !== TransportStatusEnum.FREE) {
    throw new HttpError(400, `Transport is not AVAILABLE. Current state: ${transport.status}`);
  }
  if (route.requiredTransportType !== transport.type) {
    throw new HttpError(
      400,
      `Transport type mismatch. Route requires ${route.requiredTransportType}, but transport is ${transport.type}.`,
    );
  }

  const costEUR = Number(route.distanceKm) * Number(transport.pricePerKmEUR);
  const rates = await CurrencyService.getRates('EUR', ['USD', 'UAH']);
  const costUSD = Number(costEUR.toFixed(2)) * rates.USD;
  const costUAH = Number(costEUR.toFixed(2)) * rates.UAH;

  logger.info('Calculated trip cost', { costEUR, costUSD, costUAH });

  const transaction = new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: routesTableName,
          Key: { id: routeId },
          ConditionExpression: '#status = :pendingStatus',
          UpdateExpression:
            'SET #status = :newStatus, #transportId = :transportId, #costEUR = :costEUR, #costUSD = :costUSD, #costUAH = :costUAH',
          ExpressionAttributeNames: {
            '#status': 'status',
            '#transportId': 'transportId',
            '#costEUR': 'costEUR',
            '#costUSD': 'costUSD',
            '#costUAH': 'costUAH',
          },
          ExpressionAttributeValues: {
            ':pendingStatus': RouteStatusEnum.PENDING,
            ':newStatus': RouteStatusEnum.IN_PROGRESS,
            ':transportId': transportId,
            ':costEUR': costEUR,
            ':costUSD': costUSD,
            ':costUAH': costUAH,
          },
        },
      },
      {
        Update: {
          TableName: transportTableName,
          Key: { id: transportId },
          ConditionExpression: '#status = :availableStatus',
          UpdateExpression: 'SET #status = :newStatus',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':availableStatus': TransportStatusEnum.FREE,
            ':newStatus': TransportStatusEnum.BUSY,
          },
        },
      },
    ],
  });

  try {
    await db.send(transaction);
  } catch (error: any) {
    if (error.name === 'TransactionCanceledException') {
      throw new HttpError(
        400,
        'Assignment failed. The state of the route or transport has changed. Please try again.',
      );
    }
    throw error;
  }

  const updatedRoute = await db.send(
    new GetCommand({ TableName: routesTableName, Key: { id: routeId } }),
  );

  return new RouteDto(updatedRoute.Item as RouteItemType);
};

export const handler = createHandler(baseHandler);
