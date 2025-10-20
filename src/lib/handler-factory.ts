import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';
import { APIGatewayProxyResult, Handler } from 'aws-lambda';

const logger = new Logger();

type HandlerOptions = {
  successCode?: number;
};

export const createHandler = (baseHandler: Handler, options?: HandlerOptions) => {
  const wrappedHandler: Handler = async (
    event,
    context,
    callback,
  ): Promise<APIGatewayProxyResult> => {
    const result = await baseHandler(event, context, callback);

    const successCode = options?.successCode || 200;

    if (successCode === 204) {
      return {
        statusCode: 204,
        body: '',
      };
    }

    return {
      statusCode: successCode,
      body: JSON.stringify(result),
    };
  };

  return middy(wrappedHandler)
    .use(injectLambdaContext(logger, { logEvent: true }))
    .use(
      httpResponseSerializer({
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => body,
          },
        ],
        defaultContentType: 'application/json',
      }),
    )
    .use(httpErrorHandler({ logger: logger.error.bind(logger) }));
};
