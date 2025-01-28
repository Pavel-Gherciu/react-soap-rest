// train-filtering-rest/controllers/trainsController.js
const trainsData = require('../models/Train');

exports.filterTrains = (req, res) => {
  try {
    const {
      departureStation,
      arrivalStation,
      outboundDateTime,  // "2025-02-05T09:00"
      returnDateTime,    // optional, if searching round trip
      tickets,
      travelClass
    } = req.body;

    // Very simplistic filter: checking stations, date/time, seats
    let matchedTrains = trainsData.filter(train => {
      const isDepartureMatch = train.departureStation === departureStation;
      const isArrivalMatch = train.arrivalStation === arrivalStation;

      // Example date/time check
      const isDateTimeMatch = train.departureTime >= outboundDateTime;
      // For return, you might do a separate check or separate search

      // Check if seats are sufficient in the chosen class
      const seatsLeft = train.seatsAvailable[travelClass.toLowerCase()] || 0;
      const hasEnoughSeats = seatsLeft >= tickets;

      return (
        isDepartureMatch &&
        isArrivalMatch &&
        isDateTimeMatch &&
        hasEnoughSeats
      );
    });

    if (matchedTrains.length === 0) {
      return res.status(200).json({ message: "No available trains." });
    }

    // Also calculate the “fare” for each train depending on ticket type
    // (flexible vs. not flexible), etc. For demonstration we just embed dummy fare:
    matchedTrains = matchedTrains.map(train => {
      return {
        ...train,
        fare: {
          flexible: 100,
          notFlexible: 60
        }
      };
    });

    return res.status(200).json(matchedTrains);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error filtering trains" });
  }
};

exports.updateReservation = (req, res) => {
  try {
    const { trainIDs, travelClass, tickets } = req.body;
    // For a round trip, you'd have multiple train IDs.

    for (const trainID of trainIDs) {
      const train = trainsData.find(t => t.id === trainID);
      if (!train) {
        return res.status(200).json({ success: false, message: `Train ID ${trainID} not found.` });
      }
      const seatsLeft = train.seatsAvailable[travelClass.toLowerCase()];
      if (seatsLeft < tickets) {
        return res.status(200).json({ 
          success: false, 
          message: `Train ID ${trainID} does not have enough seats.` 
        });
      }
    }

    // If all trains have enough seats, update them
    for (const trainID of trainIDs) {
      const train = trainsData.find(t => t.id === trainID);
      train.seatsAvailable[travelClass.toLowerCase()] -= tickets;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating reservation." });
  }
};
