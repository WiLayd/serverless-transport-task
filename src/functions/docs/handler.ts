import { readFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'openapi.json');
const swaggerSpec = readFileSync(filePath, 'utf-8');

export const handler = async () => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Swagger UI</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
            window.onload = function() {
                SwaggerUIBundle({
                    spec: ${swaggerSpec},
                    dom_id: '#swagger-ui',
                });
            };
        </script>
    </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html,
  };
};
