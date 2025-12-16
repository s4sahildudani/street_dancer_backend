const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Street Dance Backend API',
      version: '1.0.0',
      description: 'API documentation for Street Dance Backend'
    },
    servers: process.env.NODE_ENV === 'production' 
      ? [
          {
            url: 'https://street-dancer-backend.vercel.app',
            description: 'Production server'
          }
        ]
      : [
          {
            url: 'http://localhost:4000',
            description: 'Local development server'
          },
          {
            url: 'https://street-dancer-backend.vercel.app',
            description: 'Production server (for testing)'
          }
        ],
    components: {
      schemas: {}
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;