import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpError } from 'src/lib/http-error';
import { db } from 'src/lib/dynamodb-client';
import { createHandler } from 'src/lib/handler-factory';

const tableName = process.env.TRANSPORT_TABLE_NAME;

/**
 * @openapi
 * /dev/transport/{id}:
 *   delete:
 *     summary: Delete a transport vehicle
 *     description: Permanently deletes a transport vehicle record from the database using its unique ID.
 *     tags:
 *       - Transport
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the transport vehicle to be deleted.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Transport vehicle deleted successfully. No content is returned.
 *       '400':
 *         description: Bad Request. The transport ID is missing from the path.
 *       '404':
 *         description: Not Found. A transport vehicle with the specified ID does not exist.
 */

const baseHandler = async (event: APIGatewayProxyEvent) => {
  const transportId = event.pathParameters?.id;
  if (!transportId) {
    throw new HttpError(400, 'transportId path parameter is required');
  }

  await db.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id: transportId },
    }),
  );

  return { message: 'Transport deleted successfully' };
};

export const handler = createHandler(baseHandler, { successCode: 204 });
