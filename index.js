const express = require('express');
const { poolPromise } = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();

// Add CORS middleware
app.use(cors());
app.use(express.json());

console.log('👋 Welcome Street Dance Backend!');

// Favicon handler - 504 error fix
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Street Dance Backend API',
    swagger: '/api-docs',
    timestamp: new Date().toISOString()
  });
});

// Swagger UI - FIXED VERSION
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Street Dance API',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Routes
app.use('/users', require('./routes/users'));
app.use('/instructors', require('./routes/instructors'));
app.use('/dancedata', require('./routes/dancedata'));
app.use('/danceclasses', require('./routes/danceclasses'));
app.use('/danceforms', require('./routes/danceforms'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server for local development
const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

// Export for Vercel Serverless
module.exports = app;