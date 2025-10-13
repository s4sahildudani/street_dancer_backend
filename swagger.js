const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Street Dance Backend API',
      version: '1.0.0',
      description: 'API documentation for Street Dance Backend'
    },
    components: {}
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;