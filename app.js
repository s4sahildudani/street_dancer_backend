const express = require('express');
const { poolPromise } = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes (keep your existing route files)
app.use('/users', require('./routes/users'));
app.use('/instructors', require('../routes/instructors'));
app.use('/dancedata', require('../routes/dancedata'));
app.use('/danceclasses', require('../routes/danceclasses'));
app.use('/danceforms', require('../routes/danceforms'));

module.exports = app;