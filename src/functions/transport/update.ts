import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { buildUpdateExpression } from 'src/common/utils/dynamodb-helpers';
import { validateAndTransform } from 'src/common/utils/validation';
import { UpdateTransportDto } from 'src/functions/transport/dto/request-dto/update-transport.dto';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.TRANSPORT_TABLE_NAME;

/**
 * @openapi
 * /dev/transport/{id}:
 *   patch:
 *     summary: Update an existing transport vehicle
 *     description: >
 *       Partially updates a transport vehicle's properties.
 *       Any fields provided in the request body will overwrite existing values.
 *     tags:
 *       - Transport
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the transport vehicle to update.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: An object containing the fields to update. At least one field must be provided.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransportDto'
 *     responses:
 *       '200':
 *         description: Transport updated successfully. Returns the complete updated vehicle object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransportDto'
 *       '400':
 *         description: Bad Request. The request is malformed, the ID is missing, or the request body is empty or invalid.
 *       '404':
 *         description: Not Found. A transport vehicle with the specified ID does not exist.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const transportId = event.pathParameters?.id;
  if (!transportId) {
    throw new HttpError(400, 'transportId path parameter is required');
  }
  if (!event.body) {
    throw new HttpError(400, 'Request body is missing');
  }

  const updateDto = await validateAndTransform(UpdateTransportDto, JSON.parse(event.body));

  if (Object.keys(updateDto).length === 0) {
    throw new HttpError(400, 'At least one field must be provided for update');
  }

  const { updateExpression, expressionAttributeValues, expressionAttributeNames } =
    buildUpdateExpression(updateDto);

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id: transportId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  });

  const result = await db.send(command);

  return result.Attributes;
};

export const handler = createHandler(baseHandler);
