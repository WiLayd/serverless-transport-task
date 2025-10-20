import { randomUUID } from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { TransportStatusEnum } from 'src/common/enums/transport.enum';
import { validateAndTransform } from 'src/common/utils/validation';
import { CreateTransportDto } from 'src/functions/transport/dto/request-dto/create-transport.dto';
import { TransportDto } from 'src/functions/transport/dto/response-dto/transport.dto';
import { TransportItemType } from 'src/functions/transport/types/transport.type';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.TRANSPORT_TABLE_NAME;

/**
 * @openapi
 * /dev/transport:
 *   post:
 *     summary: Create a new transport vehicle
 *     tags:
 *       - Transport
 *     requestBody:
 *       required: true
 *       description: Data for the new transport vehicle.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransportDto'
 *     responses:
 *       '201':
 *         description: Transport created successfully. Returns the full new transport object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransportDto'
 *       '400':
 *         description: Bad Request. The request body is missing or fails validation.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new HttpError(400, 'Request body is missing');
  }

  const createDto = await validateAndTransform(CreateTransportDto, JSON.parse(event.body));

  const newTransport: TransportItemType = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: TransportStatusEnum.FREE,
    ...createDto,
  };

  await db.send(
    new PutCommand({
      TableName: tableName,
      Item: newTransport,
    }),
  );

  return new TransportDto(newTransport);
};

export const handler = createHandler(baseHandler, { successCode: 201 });
