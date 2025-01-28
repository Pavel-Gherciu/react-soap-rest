// controllers/trainReservationController.js

const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

exports.updateReservation = async (req, res) => {
  const { trainIDs, travelClass, tickets } = req.body;

  function getSeatsColumn(cls) {
    switch ((cls || '').toLowerCase()) {
      case 'first': return 'seatsFirst';
      case 'business': return 'seatsBusiness';
      default: return 'seatsStandard';
    }
  }
  const seatsCol = getSeatsColumn(travelClass);

  try {
    // 1) Fetch all the trains
    const trains = await db('trains').whereIn('id', trainIDs);

    if (trains.length !== trainIDs.length) {
      return res.json({ success: false, message: "Some Train IDs not found." });
    }

    // 2) Check seat availability
    for (const train of trains) {
      if (train[seatsCol] < tickets) {
        return res.json({
          success: false,
          message: `Train ${train.id} does not have enough seats for class ${travelClass}.`
        });
      }
    }

    // 3) If OK, update each train's seat count
    for (const train of trains) {
      const newCount = train[seatsCol] - tickets;
      await db('trains')
        .where({ id: train.id })
        .update({ [seatsCol]: newCount });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating reservation." });
  }
};

exports.cancelReservation = async (req, res) => {
  const { reservationID } = req.body;
  try {
    // Implement the logic to cancel the reservation
    // For example, update the reservation status in the database
    await db('reservations').where({ id: reservationID }).update({ status: 'cancelled' });
    res.json({ success: true, message: 'Reservation cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error cancelling reservation' });
  }
};
