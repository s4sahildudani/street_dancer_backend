const serverless = require('serverless-http');
const app = require('../app');
module.exports = serverless(app);
app.get('/favicon.ico', (req, res) => res.status(204).end());