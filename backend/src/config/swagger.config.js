const swaggerJsdoc = require('swagger-jsdoc');
const appConfig = require('./app.config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comzile Multi-Tenant SaaS eCommerce API',
      version: '1.0.0',
      description: 'Production-ready RESTful API for Multi-Tenant SaaS eCommerce Platform (Phase 1 Foundation)'
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port}/api/${appConfig.apiVersion}`,
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        StoreHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-store-id',
          description: 'Store ID for Multi-Tenant context'
        }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js', './src/routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
