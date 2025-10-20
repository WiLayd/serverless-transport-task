/* eslint-disable no-console */
import { writeFileSync } from 'fs';
import { getMetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import swaggerJSDoc from 'swagger-jsdoc';

import 'src/common/dto/pagination.dto';
import 'src/common/dto/pagination-response.dto';
import 'src/functions/transport/dto/response-dto/transport.dto';
import 'src/functions/transport/dto/response-dto/transport-list.dto';
import 'src/functions/transport/dto/request-dto/create-transport.dto';
import 'src/functions/transport/dto/request-dto/update-transport.dto';
import 'src/functions/routes/dto/request-dto/update-route.dto';
import 'src/functions/routes/dto/request-dto/create-route.dto';
import 'src/functions/routes/dto/response-dto/route.dto';
import 'src/functions/routes/dto/response-dto/route-list.dto';
import 'src/functions/routes/dto/request-dto/assign-transport.dto';

const schemas = validationMetadatasToSchemas({
  classValidatorMetadataStorage: getMetadataStorage(),
  refPointerPrefix: '#/components/schemas/',
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Keiki Transport API',
      version: '1.0.0',
      description: 'Keiki Transport API',
    },
    components: {
      schemas,
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ['./src/functions/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

writeFileSync('./openapi.json', JSON.stringify(swaggerSpec, null, 2));

console.log('✅ OpenAPI specification generated successfully at openapi.json');
