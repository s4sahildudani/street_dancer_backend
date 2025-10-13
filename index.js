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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', require('./routes/users'));
app.use('/instructors', require('./routes/instructors')); // Add this line
app.use('/dancedata', require('./routes/dancedata'));
app.use('/danceclasses', require('./routes/danceclasses'));
app.use('/danceforms', require('./routes/danceforms'));

app.listen(4000, () => {
    console.log('✅ Server running on http://localhost:4000');
    console.log('📚 Swagger docs at http://localhost:4000/api-docs');
});
