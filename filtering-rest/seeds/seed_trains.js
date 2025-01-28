// For reference, the real RER D from Évry-Courcouronnes to Châtelet–Les Halles 
// is roughly 40min to 45min, depending on stops.

function generateTrains() {
  const trains = [];

  // Let's pick a date range in 2025, for example:
  let baseDate = new Date("2025-03-01T05:00:00"); 
  // We'll generate for multiple hours on that day

  for (let i = 0; i < 30; i++) {
    // departure time
    const departureTime = new Date(baseDate.getTime() + i * 30 * 60000); 
    // arrival ~40 minutes after departure
    const arrivalTime = new Date(departureTime.getTime() + 40 * 60000);

    trains.push({
      departureStation: "Évry-Courcouronnes",
      arrivalStation: "Châtelet–Les Halles",
      departureTime: departureTime.toISOString().slice(0, 19).replace('T', ' '),
      arrivalTime: arrivalTime.toISOString().slice(0, 19).replace('T', ' '),
      seatsFirst: Math.floor(Math.random() * 11), // 0 to 10 seats
      seatsBusiness: Math.floor(Math.random() * 21), // 0 to 20 seats
      seatsStandard: Math.floor(Math.random() * 61), // 0 to 60 seats
    });
  }

  // Possibly also generate the reverse direction
  for (let i = 0; i < 30; i++) {
    const departureTime = new Date(baseDate.getTime() + i * 30 * 60000);
    // arrival ~45 minutes later in the reverse direction
    const arrivalTime = new Date(departureTime.getTime() + 45 * 60000);

    trains.push({
      departureStation: "Châtelet–Les Halles",
      arrivalStation: "Évry-Courcouronnes",
      departureTime: departureTime.toISOString().slice(0, 19).replace('T', ' '),
      arrivalTime: arrivalTime.toISOString().slice(0, 19).replace('T', ' '),
      seatsFirst: Math.floor(Math.random() * 11), // 0 to 10 seats
      seatsBusiness: Math.floor(Math.random() * 21), // 0 to 20 seats
      seatsStandard: Math.floor(Math.random() * 61), // 0 to 60 seats
    });
  }

  return trains;
}

exports.seed = function(knex) {
  // 1) Clear the table
  return knex('trains').del()
    .then(function() {
      // 2) Insert a ton of trains
      const data = generateTrains();
      return knex('trains').insert(data);
    });
};