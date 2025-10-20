import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { buildUpdateExpression } from 'src/common/utils/dynamodb-helpers';
import { validateAndTransform } from 'src/common/utils/validation';
import { UpdateRouteDto } from 'src/functions/routes/dto/request-dto/update-route.dto';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.ROUTES_TABLE_NAME;

/**
 * @openapi
 * /dev/routes/{id}:
 *   patch:
 *     summary: Update an existing route
 *     tags:
 *       - Routes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the route to update.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: An object containing the fields to update. At least one field must be provided.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRouteDto'
 *     responses:
 *       '200':
 *         description: Route updated successfully. Returns the complete updated route object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteDto'
 *       '400':
 *         description: Bad Request. The request is malformed, the ID is missing, or the request body is empty or invalid.
 *       '404':
 *         description: Not Found. A route with the specified ID does not exist.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const routeId = event.pathParameters?.id;
  if (!routeId) {
    throw new HttpError(400, 'routeId path parameter is required');
  }
  if (!event.body) {
    throw new HttpError(400, 'Request body is missing');
  }

  const updateDto = await validateAndTransform(UpdateRouteDto, JSON.parse(event.body));

  if (Object.keys(updateDto).length === 0) {
    throw new HttpError(400, 'At least one field must be provided for update');
  }

  const { updateExpression, expressionAttributeValues, expressionAttributeNames } =
    buildUpdateExpression(updateDto);

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id: routeId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  });

  const result = await db.send(command);

  return result.Attributes;
};

export const handler = createHandler(baseHandler);
