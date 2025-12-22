const express = require('express');
const { poolPromise } = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check route (responds quickly to avoid 504)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Street Dance Backend API is running', timestamp: new Date().toISOString() });
});

// Swagger UI setup - IMPORTANT: Yeh order aur method zaroori hai
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Street Dance API Docs"
}));

// Routes (ensure all files are lowercase)
app.use('/users', require('./routes/Users'));
app.use('/instructors', require('./routes/instructors'));
app.use('/dancedata', require('./routes/dancedata'));
app.use('/danceclasses', require('./routes/danceclasses'));
app.use('/danceforms', require('./routes/danceforms'));

module.exports = app;