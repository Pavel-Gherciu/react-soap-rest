const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('knex');
const axios = require('axios');
const config = require('./knexfile'); // Add a knexfile for your SOAP service DB
const db = knex(config.development);

const JWT_SECRET = 'supersecretkey';
const REST_BASE_URL = 'http://localhost:8001/api/';

const serviceDefinition = {
  TrainBookingService: {
    TrainBookingPort: {
      // 1. Login functionality
      login: async function (args) {
        const { username, password } = args;

        try {
          // Check the user in the database
          const user = await db('users').where({ username }).first();
          if (!user) {
            return { result: 'Login failed: User not found', token: '' };
          }

          // Verify the password
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return { result: 'Login failed: Incorrect password', token: '' };
          }

          // Generate a JWT token
          const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
            expiresIn: '1h',
          });

          return { result: 'Login successful', token };
        } catch (err) {
          console.error(err);
          return { result: 'Login failed due to an error', token: '' };
        }
      },

      // 2. Search trains (delegates to REST service)
      searchTrains: async function (args) {
        const { departureStation, arrivalStation, travelDateTime, tickets, travelClass, token } = args;

        // Verify the token
        try {
          jwt.verify(token, JWT_SECRET);
        } catch (err) {
          return { trains: [], error: 'Unauthorized: Invalid token' };
        }

        try {
          const response = await axios.post(`${REST_BASE_URL}/filterTrains`, {
            departureStation,
            arrivalStation,
            outboundDateTime: travelDateTime,
            tickets: parseInt(tickets, 10),
            travelClass,
          });

          if (response.data.message === 'No available trains.') {
            return { trains: [] };
          }
          return { trains: response.data };
        } catch (err) {
          console.error(err);
          return { trains: [] };
        }
      },

      // 3. Book trains (delegates to REST service)
      bookTrains: async function (args) {
        const { trainIDs, travelClass, tickets, token } = args;

        // Verify the token
        try {
          jwt.verify(token, JWT_SECRET);
        } catch (err) {
          return { result: 'Unauthorized: Invalid token', reservationID: null };
        }

        try {
          const response = await axios.post(`${REST_BASE_URL}/updateReservation`, {
            trainIDs: trainIDs.split(',').map((id) => parseInt(id.trim())),
            travelClass,
            tickets: parseInt(tickets, 10),
          });

          if (response.data.success) {
            return { result: 'Booking successful', reservationID: response.data.reservationID };
          } else {
            return { result: `Booking failed: ${response.data.message}`, reservationID: null };
          }
        } catch (err) {
          console.error(err);
          return { result: 'Error during booking', reservationID: null };
        }
      },

      // 4. Cancel reservation (delegates to REST service)
      cancelReservation: async function (args) {
        const { reservationID, token } = args;

        // Verify the token
        try {
          jwt.verify(token, JWT_SECRET);
        } catch (err) {
          return { result: 'Unauthorized: Invalid token' };
        }

        try {
          const response = await axios.post(`${REST_BASE_URL}/cancelReservation`, {
            reservationID: parseInt(reservationID, 10),
          });

          if (response.data.success) {
            return { result: 'Cancellation successful' };
          } else {
            return { result: `Cancellation failed: ${response.data.message}` };
          }
        } catch (err) {
          console.error(err);
          return { result: 'Error during cancellation' };
        }
      },
    },
  },
};

module.exports = serviceDefinition;
