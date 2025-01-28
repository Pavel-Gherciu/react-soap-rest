const express = require('express');
const router = express.Router();
const {
  updateReservation,
  cancelReservation
} = require('../controllers/reservation-controller');

/**
 * @swagger
 * /updateReservation:
 *   post:
 *     summary: Update a reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationID:
 *                 type: integer
 *                 example: 1
 *               trainIDs:
 *                 type: string
 *                 example: "1,2,3"
 *               travelClass:
 *                 type: string
 *                 example: "Standard"
 *               tickets:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
router.post('/updateReservation', updateReservation);

/**
 * @swagger
 * /cancelReservation:
 *   post:
 *     summary: Cancel a reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/cancelReservation', cancelReservation);

module.exports = router;