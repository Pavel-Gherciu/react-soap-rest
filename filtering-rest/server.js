// filepath: /d:/TelecomSudparis/ServiceOrientedComputing/SocProject/filtering-rest/server.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const trainFilteringRoutes = require('./routes/filter-routes');
const trainReservationRoutes = require('./routes/reservation-routes');

const app = express();
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Train Filtering REST Service',
      version: '1.0.0',
      description: 'API documentation for Train Filtering REST Service',
    },
    servers: [
      {
        url: 'http://localhost:8001/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routes
app.use('/api', trainFilteringRoutes);
app.use('/api', trainReservationRoutes);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Train Filtering REST Service running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});