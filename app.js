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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes (ensure all files are lowercase)
app.use('/users', require('./routes/users'));
app.use('/instructors', require('./routes/instructors'));
app.use('/dancedata', require('./routes/dancedata'));
app.use('/danceclasses', require('./routes/danceclasses'));
app.use('/danceforms', require('./routes/danceforms'));

module.exports = app;