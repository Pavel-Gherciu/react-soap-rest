const express = require('express');
const router = express.Router();
const {
  listAllTrains,
  getTrainById,
  filterTrains
} = require('../controllers/filter-controller');

/**
 * @swagger
 * /trains:
 *   get:
 *     summary: List all trains
 *     responses:
 *       200:
 *         description: A list of trains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/trains', listAllTrains);

/**
 * @swagger
 * /trains/{id}:
 *   get:
 *     summary: Get a train by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A train object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/trains/:id', getTrainById);

/**
 * @swagger
 * /filterTrains:
 *   post:
 *     summary: Filter trains
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departureStation:
 *                 type: string
 *               arrivalStation:
 *                 type: string
 *               outboundDateTime:
 *                 type: string
 *               tickets:
 *                 type: integer
 *               travelClass:
 *                 type: string
 *     responses:
 *       200:
 *         description: A list of filtered trains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.post('/filterTrains', filterTrains);

module.exports = router;