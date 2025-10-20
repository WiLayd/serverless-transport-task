import { randomUUID } from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { validateAndTransform } from 'src/common/utils/validation';
import { CreateRouteDto } from 'src/functions/routes/dto/request-dto/create-route.dto';
import { RouteItemType } from 'src/functions/routes/types/route.type';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.ROUTES_TABLE_NAME;

/**
 * @openapi
 * /dev/routes:
 *   post:
 *     summary: Create a new route
 *     tags:
 *       - Routes
 *     requestBody:
 *       required: true
 *       description: Data for the new route.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRouteDto'
 *     responses:
 *       '201':
 *         description: Route created successfully. Returns the full new route object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteDto'
 *       '400':
 *         description: Bad Request. The request body is missing, malformed, or fails validation checks.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new HttpError(400, 'Request body is missing');
  }

  const createDto = await validateAndTransform(CreateRouteDto, JSON.parse(event.body));

  const newRoute: RouteItemType = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: RouteStatusEnum.PENDING,
    ...createDto,
  };

  await db.send(
    new PutCommand({
      TableName: tableName,
      Item: newRoute,
    }),
  );

  return newRoute;
};

export const handler = createHandler(baseHandler, { successCode: 201 });
