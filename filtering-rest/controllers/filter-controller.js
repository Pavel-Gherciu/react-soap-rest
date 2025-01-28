// controllers/trainFilteringController.js

const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

exports.listAllTrains = async (req, res) => {
  try {
    const trains = await db('trains').select('*');
    res.json(trains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve trains" });
  }
};

exports.getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    const train = await db('trains').where({ id }).first();
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json(train);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving train" });
  }
};

exports.filterTrains = async (req, res) => {
  const { 
    departureStation, 
    arrivalStation, 
    outboundDateTime,  // e.g. "2025-03-01 06:00:00"
    tickets, 
    travelClass 
  } = req.body;

  // Map "First", "Business", "Standard" to DB columns
  function getSeatsColumn(cls) {
    switch ((cls || '').toLowerCase()) {
      case 'first': return 'seatsFirst';
      case 'business': return 'seatsBusiness';
      default: return 'seatsStandard';
    }
  }
  const seatsCol = getSeatsColumn(travelClass);

  try {
    let query = db('trains').select('*');
    if (departureStation) {
      query = query.where('departureStation', departureStation);
    }
    if (arrivalStation) {
      query = query.where('arrivalStation', arrivalStation);
    }
    if (outboundDateTime) {
      // only trains with departureTime >= outboundDateTime
      query = query.where('departureTime', '>=', outboundDateTime);
    }

    const trains = await query;
    // Filter only trains that have enough seats in the requested class
    const matched = trains.filter(t => t[seatsCol] >= tickets);

    if (matched.length === 0) {
      return res.status(200).json({ message: "No available trains." });
    }

    // Optionally add dummy fare info
    const withFares = matched.map(train => ({
      ...train,
      fare: { flexible: 12.0, notFlexible: 8.0 }
    }));

    res.json(withFares);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error filtering trains" });
  }
};
