import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.ROUTES_TABLE_NAME;

/**
 * @openapi
 * /dev/routes/{id}:
 *   delete:
 *     summary: Delete a route
 *     tags:
 *       - Routes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the route to be deleted.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Route deleted successfully. No content is returned.
 *       '400':
 *         description: Bad Request. The route ID is missing from the path.
 *       '404':
 *         description: Not Found. A route with the specified ID does not exist.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const routeId = event.pathParameters?.id;
  if (!routeId) {
    throw new HttpError(400, 'routeId path parameter is required');
  }

  await db.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id: routeId },
    }),
  );
};

export const handler = createHandler(baseHandler, { successCode: 204 });
